import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WompiService } from './wompi.service';

@Controller('payments')
export class PaymentsController {
  constructor(private prisma: PrismaService, private wompi: WompiService) {}

  @Get('wompi/verify')
  async verifyWompi(@Query('transactionId') transactionId: string, @Query('reference') reference: string) {
    if (!transactionId || !reference) throw new BadRequestException('Missing transactionId or reference');
    const order = await this.prisma.order.findUnique({ where: { id: reference } });
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

    const paymentApproved = status === 'APPROVED';

    await this.prisma.order.update({
      where: { id: reference },
      data: {
        paymentRef: String(tx?.id || transactionId),
        paymentStatus: paymentApproved ? 'APPROVED' : status === 'DECLINED' ? 'DECLINED' : 'INITIATED',
        status: paymentApproved ? 'PAID' : order.status,
        paymentMethod: 'WOMPI',
      },
    });

    return { orderId: reference, status: paymentApproved ? 'PAID' : order.status, paymentStatus: paymentApproved ? 'APPROVED' : status };
  }
}

