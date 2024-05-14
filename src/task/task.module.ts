import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { multerStorageConfig } from 'src/config/multer.config';
import { File } from 'src/file/entities/file.entity';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';
import { Task } from './entities/task.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, File]),
    MulterModule.register({
      ...multerStorageConfig,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, UserService, FileService],
})
export class TaskModule {}
