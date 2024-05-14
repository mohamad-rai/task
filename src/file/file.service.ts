import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { FileType } from './interface/file.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  createFile(file: Express.Multer.File, fileType: FileType) {
    const fileEntity = new File();
    fileEntity.fileType = fileType;
    fileEntity.originalName = file.originalname;
    fileEntity.savedName = file.filename;

    return fileEntity;
  }
}
