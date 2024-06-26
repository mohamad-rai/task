import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { File } from 'src/file/entities/file.entity';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    LocalStrategy,
    FileService,
    RefreshJwtStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([User, File]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
