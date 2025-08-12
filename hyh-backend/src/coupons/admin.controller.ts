import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/coupons')
export class AdminCouponsController {
  constructor(private coupons: CouponsService) {}

  @Get()
  list() {
    return this.coupons.list();
  }

  @Post()
  create(
    @Body()
    dto: {
      code: string;
      rule: { type: 'PERCENT' | 'FIXED'; value: number };
      startsAt?: Date | null;
      endsAt?: Date | null;
      active?: boolean;
    },
  ) {
    return this.coupons.create(dto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.coupons.setActive(id, true);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.coupons.setActive(id, false);
  }
}