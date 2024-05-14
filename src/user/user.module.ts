import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { File } from '../file/entities/file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerStorageConfig } from 'src/config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File]),
    MulterModule.register({
      ...multerStorageConfig,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
