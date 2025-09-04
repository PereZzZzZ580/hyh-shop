import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsController } from './payments.controller';
import { WompiService } from './wompi.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [WompiService],
  exports: [WompiService],
})
export class PaymentsModule {}

