import { Module } from '@nestjs/common';
import { WhatsappNotifyService } from './whatsapp.service';

@Module({
  providers: [WhatsappNotifyService],
  exports: [WhatsappNotifyService],
})
export class OrdersWhatsappModule {}
