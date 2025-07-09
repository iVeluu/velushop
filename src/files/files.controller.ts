import {
  BadRequestException,
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from './helpers/fileNamer.helper';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  getProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image!');
    }

    const secureUrl = `${this.configService.get('HOSTNAME_API')}/files/product/${file.filename}`;

    return {
      secureUrl,
    };
  }
}
