/* eslint-disable @typescript-eslint/no-require-imports */
const { PricingService } = require('./pricing.service.js');

describe('PricingService', () => {
  const service = new PricingService();

  test('calculates totals with coupon and shipping', () => {
    const result = service.preview({
      lines: [
        { qty: 2, unitPrice: 100 },
        { qty: 1, unitPrice: 50, discount: 10 },
      ],
      shipping: { baseFee: 20 },
      coupon: { type: 'percent', value: 10 },
      taxRate: 0.19,
    });

    expect(result.subtotal).toBe(240);
    expect(result.discountTotal).toBe(24);
    expect(result.shippingTotal).toBe(20);
    expect(result.taxTotal).toBe(41); // floor((240-24)*0.19)=41.04
    expect(result.grandTotal).toBe(277); // 240-24+20+41
  });
});