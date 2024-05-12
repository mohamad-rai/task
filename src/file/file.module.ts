import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerStorageConfig } from 'src/config/multer.config';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      ...multerStorageConfig,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
