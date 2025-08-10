import { Injectable } from '@nestjs/common';

@Injectable()
export class CouponsService {
  async validate(code: string, subtotal: number) {
    // MVP: no hay cupones reales, solo de ejemplo
    if (code.toLowerCase() === 'DESCUENTO10') {
      return { code, rule: { type: 'PERCENT', value: 10 } };
    }
    throw new Error('Invalid coupon');
  }
}
