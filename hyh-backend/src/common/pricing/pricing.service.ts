import { Injectable } from '@nestjs/common';

export type PriceLine = { qty: number; unitPrice: number; discount?: number };
export type PreviewInput = {
  lines: PriceLine[];
  shipping?: { baseFee?: number };
  coupon?: { type: 'percent' | 'fixed'; value: number } | null;
  taxRate?: number; // 0..1
};

@Injectable()
export class PricingService {
  preview({ lines, shipping, coupon, taxRate = 0 }: PreviewInput) {
    const subtotal = lines.reduce((acc, l) => acc + l.unitPrice * l.qty - (l.discount || 0), 0);
    const discountFromCoupon =
      coupon?.type === 'percent' ? Math.floor((subtotal * coupon.value) / 100) :
      coupon?.type === 'fixed' ? coupon.value : 0;

    const discountTotal = Math.max(0, discountFromCoupon);
    const shippingTotal = Math.max(0, shipping?.baseFee ?? 0);
    const taxTotal = Math.floor((subtotal - discountTotal) * taxRate);
    const grandTotal = Math.max(0, subtotal - discountTotal + shippingTotal + taxTotal);

    return { subtotal, discountTotal, shippingTotal, taxTotal, grandTotal };
  }
}
