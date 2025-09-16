import { Module } from '@nestjs/common';
import { OrdersEmailService } from './email.service';

@Module({
  providers: [OrdersEmailService],
  exports: [OrdersEmailService],
})
export class OrdersEmailModule {}

