import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier'; // si te da lío, mira la sección Alternativa sin streamifier

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadBuffer(buffer: Buffer, opts: UploadApiOptions = {}): Promise<UploadApiResponse> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(opts, (error, res) => {
          if (error || !res) return reject(error);
          resolve(res);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
      return result;
    } catch {
      throw new InternalServerErrorException('Error subiendo imagen a Cloudinary');
    }
  }

  async delete(publicId: string): Promise<{ result: string }> {
    const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return { result: res.result };
  }
}
