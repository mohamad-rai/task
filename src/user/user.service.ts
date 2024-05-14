import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'src/common/utils';
import { File } from 'src/file/entities/file.entity';
import { FileType } from 'src/file/interface/file.interface';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly fileService: FileService,
  ) {}

  async create(user: CreateUserDto) {
    const isUserExists = await this.findOne([
      { email: user.email },
      { username: user.username },
      { mobile: user.mobile },
    ]);
    if (isUserExists) {
      throw new HttpException('User exists!', HttpStatus.BAD_REQUEST);
    }
    user.password = await hash(user.password);
    const createdUser = await this.userRepository.insert(user);
    delete user.password;
    return {
      ...user,
      id: createdUser.identifiers[0].id,
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(userFields: Partial<User> | Partial<User>[]) {
    const user = await this.userRepository.findOne({ where: userFields });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | Omit<UpdateUserDto, 'isAdmin'>,
  ) {
    await this.userRepository.update({ id }, updateUserDto);
    const updatedUser = await this.findOne({ id });
    return updatedUser;
  }

  async updateProfile(userId: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        profileImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const profileImage: File = this.fileService.createFile(
      file,
      FileType.PROFILE,
    );

    user.profileImage = profileImage;

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
