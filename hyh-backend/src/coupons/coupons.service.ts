import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
interface CouponRule {
  type: 'PERCENT' | 'FIXED';
  value: number;
}

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.coupon.findMany({ orderBy: { code: 'asc' } });
  }

  create(params: {
    code: string;
    rule: CouponRule;
    startsAt?: Date | null;
    endsAt?: Date | null;
    active?: boolean;
  }) {
    return this.prisma.coupon.create({
      data: {
        code: params.code.toUpperCase(),
        rule: params.rule as any,
        startsAt: params.startsAt ?? null,
        endsAt: params.endsAt ?? null,
        active: params.active ?? true,
      },
    });
  }

  setActive(id: string, active: boolean) {
    return this.prisma.coupon.update({ where: { id }, data: { active } });
  }

  async validate(code: string, _subtotal: number) {
    const now = new Date();
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
    });
    if (!coupon) throw new Error('Invalid coupon');
    return coupon;
  }
}
