import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
  Put,
  UploadedFile,
  HttpException,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { IRequest } from 'src/common/interface/express-request.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { IResponse } from 'src/common/interface/response.interface';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.create(createUserDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    try {
      return this.userService.findAll();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('me')
  async getProfile(@Req() req: IRequest) {
    try {
      const user = await this.userService.findOne({ id: req.user.id });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Patch('me')
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
    }),
  )
  async updateProfile(@Req() req: IRequest, @Body() body: UpdateUserDto) {
    try {
      const { id } = req.user;
      const updateUser = await this.userService.update(id, body);
      return updateUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findOne({ id: id });
      if (!user) {
        throw new NotFoundException('User not found!');
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto & { isAdmin?: boolean },
  ) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Put('me/profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateMyProfile(
    @Req() req: IRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<IResponse<File> | HttpException> {
    try {
      await this.userService.updateProfile(req.user.id, file);

      return {
        success: true,
        message: 'file uploaded successfully',
      };
    } catch (error) {
      console.log(error);
      return new HttpException('Bad request', 400);
    }
  }

  @UseGuards(AdminGuard)
  @Put('profile-image/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @Req() req: IRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<IResponse<File> | HttpException> {
    try {
      await this.userService.updateProfile(req.user.id, file);

      return {
        success: true,
        message: 'file uploaded successfully',
      };
    } catch (error) {
      console.log(error);
      return new HttpException('Bad request', 400);
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
