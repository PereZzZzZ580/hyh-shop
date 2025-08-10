import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AddressService } from './address.service';
import { UpsertAddressDto, SetDefaultDto } from './address.dto';

@UseGuards(JwtAuthGuard)
@Controller('me/addresses')
export class AddressController {
  constructor(private addr: AddressService) {}

  @Get()
  list(@Req() req: any) {
    return this.addr.list(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() body: UpsertAddressDto) {
    return this.addr.create(req.user.sub, body);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: Partial<UpsertAddressDto>) {
    return this.addr.update(req.user.sub, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.addr.remove(req.user.sub, id);
  }

  @Post('set-default')
  setDefault(@Req() req: any, @Body() body: SetDefaultDto) {
    return this.addr.setDefault(req.user.sub, body.id);
  }
}
