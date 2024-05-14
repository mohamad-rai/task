import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { IRequest } from '../common/interface/express-request.interface';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: IRequest, @Res() response: Response) {
    try {
      const loginResponse = await this.authService.login(req.user);
      response.status(HttpStatus.OK).json(loginResponse);
    } catch (error) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Req() req: IRequest) {
    return this.authService.refreshToken(req.user);
  }
}
