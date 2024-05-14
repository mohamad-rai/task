import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UserService } from 'src/user/user.service';
import { FileService } from 'src/file/file.service';
import { FileType } from 'src/file/interface/file.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}
  async create(
    userId: number,
    createTaskDto: CreateTaskDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not exists!');
    }

    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.creator = user;

    if (file) {
      const createdFile = this.fileService.createFile(
        file,
        FileType.ATTACHMENT,
      );
      task.file = createdFile;
    }

    const savedTask = await this.taskRepository.save(task);

    return savedTask;
  }

  findAll(user?: User) {
    const where: Record<string, any> = {};
    if (user) {
      where['creator'] = { id: user.id };
    }
    return this.taskRepository.find(where);
  }

  async findOne(id: number, user?: User) {
    const where: Record<string, any> = {
      id,
    };
    if (user) {
      where['creator'] = { id: user.id };
    }
    const task = await this.taskRepository.findOne({ where });
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    file: Express.Multer.File,
    user?: User,
  ) {
    const where: Record<string, any | number> = {
      id,
    };
    if (user) {
      where['creator'] = { id: user.id };
    }
    const task = await this.taskRepository.findOneBy(where);
    if (!task) {
      throw new NotFoundException('Task not found!');
    }

    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;

    if (file) {
      const createdFile = this.fileService.createFile(
        file,
        FileType.ATTACHMENT,
      );
      task.file = createdFile;
    }

    const savedTask = await this.taskRepository.save(task);

    return savedTask;
  }

  async remove(id: number, user?: User) {
    const where: Record<string, any | number> = {
      id,
    };
    if (user) {
      where['creator'] = { id: user.id };
    }
    const task = await this.taskRepository.findOneBy(where);
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    await this.taskRepository.remove(task);
    return { deleted: true };
  }
}
