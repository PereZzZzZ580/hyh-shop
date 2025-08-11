import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingService {
  async quote({ city, weightGr: _weightGr }: { city?: string; weightGr: number }) {
    // MVP: tarifa fija local
    let base = 8000;
    if (city && city.toLowerCase().includes('armenia')) base = 5000;
    if (city && city.toLowerCase().includes('calarca')) base = 6000;

    return { total: base, breakdown: { base } };
  }
}
