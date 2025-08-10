import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(input: { userId: string }) {
    let cart = await this.prisma.cart.findFirst({ where: { userId: input.userId } });
    if (!cart) cart = await this.prisma.cart.create({ data: { userId: input.userId } });
    return cart;
  }

  async get(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { variant: { include: { product: { select: { name: true, slug: true, brand: true } } } } },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(params: { userId: string; variantId: string; qty: number }) {
    const cart = await this.getOrCreateCart({ userId: params.userId });

    const variant = await this.prisma.variant.findUnique({ where: { id: params.variantId } });
    if (!variant) throw new NotFoundException('Variant not found');

    const existing = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, variantId: params.variantId } });
    const priceSnapshot = variant.price;

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + params.qty, priceSnapshot },
      });
      return this.get(cart.id);
    }

    await this.prisma.cartItem.create({
      data: { cartId: cart.id, variantId: params.variantId, qty: params.qty, priceSnapshot },
    });
    return this.get(cart.id);
  }

  async updateItem(userId: string, cartItemId: string, qty: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { cart: true } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.cart.userId !== userId) throw new ForbiddenException();
    await this.prisma.cartItem.update({ where: { id: cartItemId }, data: { qty } });
    return this.get(item.cartId);
    // (si no quieres devolver todo el carrito, puedes devolver solo el item actualizado)
  }

  async removeItem(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: cartItemId }, include: { cart: true } });
    if (!item) return;
    if (item.cart.userId !== userId) throw new ForbiddenException();
    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return this.get(item.cartId);
  }
}
