import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingService } from '../common/pricing/pricing.service';
import { CouponsService } from '../coupons/coupons.service';
import { ShippingService } from '../shipping/shipping.service';

const COD_CITIES = (process.env.COD_CITIES || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private pricing: PricingService,
    private coupons: CouponsService,
    private shipping: ShippingService,
  ) {}

  private async assertCartOwner(cartId: string, userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.userId !== userId) throw new ForbiddenException();
    return cart;
  }

  async preview(
    cartId: string,
    couponCode: string | undefined,
    userId: string,
    opts?: { city?: string; paymentMethod?: 'COD' | 'WHATSAPP' }
  ) {
    await this.assertCartOwner(cartId, userId);
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const lines = cart.items.map(i => ({ qty: i.qty, unitPrice: i.priceSnapshot || i.variant.price }));
    const subtotal = lines.reduce((acc, l) => acc + l.unitPrice * l.qty, 0);

    // cupón (si viene)
    const coupon = couponCode ? await this.coupons.validate(couponCode, subtotal).catch(() => null) : null;

    // envío (por ciudad & peso)
    const weightGr = cart.items.reduce((acc, i) => acc + (i.variant.weight ?? 500) * i.qty, 0);
    const ship = await this.shipping.quote({ city: opts?.city, weightGr });

    // validar COD por ciudad
    if (opts?.paymentMethod === 'COD' && COD_CITIES.length) {
      const city = (opts?.city || '').toLowerCase();
      if (!city || !COD_CITIES.includes(city)) {
        throw new BadRequestException(`Contraentrega solo disponible en: ${COD_CITIES.join(', ')}`);
      }
    }

    const totals = this.pricing.preview({
      lines,
      shipping: { baseFee: ship.total },
      coupon: coupon ? { type: coupon.rule.type as any, value: (coupon.rule as any).value } : null,
      taxRate: 0,
    });

    const waText = this.buildWhatsAppText(
      cart.items.map(i => ({ name: i.variant.product.name, qty: i.qty, unit: i.priceSnapshot || i.variant.price })),
      totals.grandTotal,
    );

    return {
      cartId,
      items: cart.items.map(i => ({
        id: i.id,
        variantId: i.variantId,
        qty: i.qty,
        unitPrice: i.priceSnapshot || i.variant.price,
        name: i.variant.product.name,
      })),
      shipping: ship,
      coupon: coupon ? { code: (coupon as any).code, discount: totals.discountTotal } : null,
      totals,
      paymentMethod: opts?.paymentMethod ?? null,
      whatsapp: WHATSAPP_NUMBER
        ? { number: WHATSAPP_NUMBER, message: waText, waLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}` }
        : null,
    };
  }

  async createFromCart(params: {
    cartId: string;
    userId: string;
    paymentMethod: 'COD' | 'WHATSAPP';
    addressId?: string | null;
    addressRaw?: { country?: string; city?: string; line1?: string; line2?: string; phone?: string; zip?: string } | null;
    contactName?: string | null;
    contactPhone?: string | null;
  }) {
    await this.assertCartOwner(params.cartId, params.userId);
    const cart = await this.prisma.cart.findUnique({
      where: { id: params.cartId },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (!cart || cart.items.length === 0) throw new BadRequestException('Cart is empty');

    // validar COD por ciudad
    const city = (params.addressRaw?.city || '').toLowerCase();
    if (params.paymentMethod === 'COD' && COD_CITIES.length && !COD_CITIES.includes(city)) {
      throw new BadRequestException(`Contraentrega solo disponible en: ${COD_CITIES.join(', ')}`);
    }

    // totales
    const weightGr = cart.items.reduce((acc, i) => acc + (i.variant.weight ?? 500) * i.qty, 0);
    const ship = await this.shipping.quote({ city: params.addressRaw?.city, weightGr });
    const lines = cart.items.map(i => ({ qty: i.qty, unitPrice: i.priceSnapshot || i.variant.price }));
    const totals = this.pricing.preview({ lines, shipping: { baseFee: ship.total }, taxRate: 0 });

    // transacción
    const order = await this.prisma.$transaction(async (tx) => {
      // stock
      for (const it of cart.items) {
        if (it.variant.stock < it.qty) throw new BadRequestException(`Sin stock para variante ${it.variantId}`);
      }

      const created = await tx.order.create({
        data: {
          userId: params.userId,
          addressId: params.addressId ?? null,
          status: 'PENDING',
          paymentStatus: 'INITIATED',
          paymentMethod: params.paymentMethod as any,
          contactName: params.contactName ?? null,
          contactPhone: params.contactPhone ?? null,
          shipmentStatus: 'NONE',
          currency: 'COP',
          subtotal: totals.subtotal,
          discountTotal: totals.discountTotal,
          shippingTotal: totals.shippingTotal,
          taxTotal: totals.taxTotal,
          grandTotal: totals.grandTotal,
          items: {
            create: cart.items.map((i) => ({
              variantId: i.variantId,
              qty: i.qty,
              unitPrice: i.priceSnapshot || i.variant.price,
              discount: 0,
            })),
          },
        },
      });

      for (const it of cart.items) {
        await tx.variant.update({
          where: { id: it.variantId },
          data: {
            stock: { decrement: it.qty },
            movements: { create: { type: 'OUT', qty: it.qty, note: `Order ${created.id}` } },
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return created;
    });

    const waText = this.buildWhatsAppText(
      cart.items.map(i => ({ name: i.variant.product.name, qty: i.qty, unit: i.priceSnapshot || i.variant.price })),
      totals.grandTotal,
    );

    return {
      orderId: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totals,
      whatsapp:
        params.paymentMethod === 'WHATSAPP' && WHATSAPP_NUMBER
          ? { number: WHATSAPP_NUMBER, waLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}` }
          : null,
    };
  }

  async getForUser(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException();
    if (order.userId !== userId) throw new ForbiddenException();
    return order;
  }

  async summary(orderId: string, userId: string) {
    const o = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { product: true } } } }, address: true },
    });
    if (!o) throw new NotFoundException();
    if (o.userId !== userId) throw new ForbiddenException();

    const waText = this.buildWhatsAppText(
      o.items.map(i => ({ name: i.variant.product.name, qty: i.qty, unit: i.unitPrice })),
      o.grandTotal,
    );
    const waLink = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}` : null;
    return {
      id: o.id,
      paymentMethod: o.paymentMethod,
      totals: {
        subtotal: o.subtotal,
        discountTotal: o.discountTotal,
        shippingTotal: o.shippingTotal,
        taxTotal: o.taxTotal,
        grandTotal: o.grandTotal,
      },
      items: o.items.map(i => ({ name: i.variant.product.name, qty: i.qty, unitPrice: i.unitPrice })),
      whatsapp: WHATSAPP_NUMBER ? { number: WHATSAPP_NUMBER, waLink } : null,
      address: o.address ?? null,
    };
  }

  private buildWhatsAppText(items: { name: string; qty: number; unit: number }[], grandTotal: number) {
    const lines = items.map(i => `• ${i.name} x${i.qty} — $${i.unit.toLocaleString('es-CO')}`).join('%0A');
    return `Hola, quiero confirmar este pedido:%0A${lines}%0A%0ATotal: $${grandTotal.toLocaleString('es-CO')}`;
  }
}
