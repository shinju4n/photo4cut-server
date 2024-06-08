import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { getUniqueFileName } from 'src/common';

@Controller('media')
export class MediaController {
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    const s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
    const uuid = Date.now();
    const fileName = getUniqueFileName(file, uuid);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `origin/${fileName}`,
      Body: file.buffer,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/origin/${fileName}`;
  }
}
