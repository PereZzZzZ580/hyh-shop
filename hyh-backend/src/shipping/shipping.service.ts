import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async quote({ city, weightGr }: { city?: string; weightGr: number }) {
    const weightKg = Math.ceil(weightGr / 1000);
    const zones = await this.prisma.shippingZone.findMany();
    const cityLc = city?.toLowerCase();
    let zone = cityLc
      ? zones.find((z) => z.cities.some((c) => c.toLowerCase() === cityLc))
      : undefined;
    if (!zone) zone = zones.find((z) => z.cities.length === 0) || zones[0];

    const extra = zone.perKg * weightKg;
    const total = zone.baseFee + extra;
    return { total, breakdown: { base: zone.baseFee, perKg: zone.perKg, weightKg } };
  }
}
