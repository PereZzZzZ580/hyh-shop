class PricingService {
  preview({ lines, shipping, coupon, taxRate = 0 }) {
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

module.exports = { PricingService };