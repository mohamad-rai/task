import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFile } from './interface/file.interface';
import { File } from './entities/file.entity';
import { UploadFileDto } from './dto/file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  saveFile(file: Express.Multer.File & UploadFileDto) {
    const fileObject: IFile = {
      originalName: file.originalname,
      savedName: file.filename,
      fileType: file.fileType,
    };

    console.log(process.env.JWT_SECRET);
    return this.fileRepository.insert(fileObject);
  }

  getFile(fileName: string) {
    return this.fileRepository.findOne({ where: { savedName: fileName } });
  }
}
