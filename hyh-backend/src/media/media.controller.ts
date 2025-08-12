import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  list(@Query('productId') productId?: string, @Query('variantId') variantId?: string) {
    return this.mediaService.list({ productId, variantId });
    }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
  @Roles('ADMIN')
  @Throttle(20, 60)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaDto })
  uploadOne(
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: /^(image\/)\w+/ })] }),
    ) file: Express.Multer.File,
    @Body() dto: CreateMediaDto,
  ) {
    return this.mediaService.uploadOne(file, dto);
  }

  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('files', 10))
  @UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
  @Roles('ADMIN')
  @Throttle(20, 60)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaDto })
  uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateMediaDto,
  ) {
    return this.mediaService.uploadMany(files, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}