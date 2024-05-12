import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB } from './common/const';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { FileModule } from './file/file.module';
import { File } from './file/entities/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB.HOST,
      port: DB.PORT,
      username: DB.USERNAME,
      password: DB.PASSWORD,
      database: DB.NAME,
      entities: [User, File],
      synchronize: true,
    }),
    UserModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
