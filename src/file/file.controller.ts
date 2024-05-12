import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { IResponse } from 'src/common/interface/response.interface';
import { File } from './entities/file.entity';
import { UploadFileDto } from './dto/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() body: UploadFileDto,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<IResponse<File> | HttpException> {
    try {
      await this.fileService.saveFile({ ...file, ...body });

      return {
        success: true,
        message: 'file uploaded successfully',
      };
    } catch (error) {
      console.log(error);
      return new HttpException('Bad request', 400);
    }
  }

  @Get('/:savedName')
  getFile(@Param('savedName') savedName) {
    try {
      return this.fileService.getFile(savedName);
    } catch (error) {
      console.log(error);
      return new HttpException('Bad request', 400);
    }
  }
}
