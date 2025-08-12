import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    CloudinaryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        limits: { fileSize: Number(config.get('MAX_IMAGE_SIZE_MB', 8)) * 1024 * 1024 },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, RolesGuard],
  exports: [MediaService],
})
export class MediaModule {}