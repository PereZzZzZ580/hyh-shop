import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersEmailService } from '../orders/email.service';
import { WompiService } from './wompi.service';

@Controller('payments')
export class PaymentsController {
  constructor(private prisma: PrismaService, private wompi: WompiService, private email: OrdersEmailService) {}

  @Get('wompi/verify')
  async verifyWompi(@Query('transactionId') transactionId: string, @Query('reference') reference: string) {
    if (!transactionId || !reference) throw new BadRequestException('Missing transactionId or reference');
    const order = await this.prisma.order.findUnique({
      where: { id: reference },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });
    if (!order) throw new BadRequestException('Order not found');

    const data = await this.wompi.fetchTransaction(transactionId);
    const tx = data?.data || data;
    const status = String(tx?.status || '').toUpperCase();
    const amountInCents = Number(tx?.amount_in_cents || 0);
    const referenceResp = tx?.reference || '';

    if (referenceResp && referenceResp !== reference) {
      throw new BadRequestException('Reference mismatch');
    }
    const expectedCents = order.grandTotal * 100;
    if (expectedCents !== amountInCents) {
      throw new BadRequestException('Amount mismatch');
    }

    const wasAlreadyApproved = order.paymentStatus === 'APPROVED' || order.status === 'PAID';

    const paymentApproved = status === 'APPROVED';

    const updated = await this.prisma.order.update({
      where: { id: reference },
      data: {
        paymentRef: String(tx?.id || transactionId),
        paymentStatus: paymentApproved ? 'APPROVED' : status === 'DECLINED' ? 'DECLINED' : 'INITIATED',
        status: paymentApproved ? 'PAID' : order.status,
        paymentMethod: 'WOMPI',
      },
      include: { items: { include: { variant: { include: { product: true } } } } },
    });

    if (paymentApproved && !wasAlreadyApproved) {
      void this.email.notifyPaymentApproved({
        orderId: updated.id,
        createdAt: updated.createdAt.toISOString(),
        userId: updated.userId,
        paymentMethod: updated.paymentMethod as 'COD' | 'WHATSAPP' | 'WOMPI',
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        totals: {
          subtotal: updated.subtotal,
          discountTotal: updated.discountTotal,
          shippingTotal: updated.shippingTotal,
          grandTotal: updated.grandTotal,
        },
        contactName: updated.contactName ?? null,
        contactPhone: (updated.contactPhone ?? updated.phone) || null,
        city: updated.city ?? null,
        items: updated.items.map((item) => ({
          name: item.variant?.product?.name ?? item.variantId,
          qty: item.qty,
          unitPrice: item.unitPrice,
        })),
      });
    }

    return { orderId: reference, status: updated.status, paymentStatus: updated.paymentStatus };
  }
}

