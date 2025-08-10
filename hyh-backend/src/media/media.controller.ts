import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UploadedFile, UploadedFiles, UseInterceptors, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  list(@Query('productId') productId?: string, @Query('variantId') variantId?: string) {
    return this.mediaService.list({ productId, variantId });
    }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
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
  uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateMediaDto,
  ) {
    return this.mediaService.uploadMany(files, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}