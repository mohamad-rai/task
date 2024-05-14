import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IRequest } from 'src/common/interface/express-request.interface';

@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('me')
  @UseInterceptors(FileInterceptor('file'))
  createForMe(
    @Req() req: IRequest,
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      return this.taskService.create(req.user.id, createTaskDto, file);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('me')
  findAllForMe(@Req() req: IRequest) {
    try {
      return this.taskService.findAll(req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('me/:id')
  findOneForMe(@Param('id', ParseIntPipe) id: number, @Req() req: IRequest) {
    try {
      return this.taskService.findOne(id, req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Patch('me/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateForMe(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: IRequest,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      return this.taskService.update(id, updateTaskDto, file, req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Delete('me/:id')
  removeForMe(@Param('id', ParseIntPipe) id: number, @Req() req: IRequest) {
    try {
      return this.taskService.remove(id, req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    try {
      return this.taskService.findAll();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.taskService.findOne(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.taskService.remove(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
