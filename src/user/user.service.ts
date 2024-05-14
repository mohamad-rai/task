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
import { UserValidator } from './validation/create.validation';
import { File } from 'src/file/entities/file.entity';
import { FileType } from 'src/file/interface/file.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(user: CreateUserDto) {
    const validating = UserValidator.validateUser(user);
    if (!validating.validated) {
      throw new HttpException(validating.message, HttpStatus.BAD_REQUEST);
    }
    const isUserExists = await this.findOne([
      { email: user.email },
      { username: user.username },
    ]);
    if (isUserExists) {
      throw new HttpException('User exists!', HttpStatus.BAD_REQUEST);
    }
    user.password = await hash(user.password);
    const createdUser = await this.userRepository.insert(user);
    return {
      ...user,
      id: createdUser.identifiers[0].id,
    };
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(userFields: Partial<User> | Partial<User>[]) {
    return this.userRepository.findOne({ where: userFields });
  }

  async findOneWithUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    delete user.created_at;
    delete user.updated_at;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const validating = UserValidator.validateUser(updateUserDto);
    if (!validating.validated) {
      throw new HttpException(validating.message, HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.update({ id }, updateUserDto);
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

    let profileImage: File = user.profileImage || new File();
    profileImage.originalName = file.originalname;
    profileImage.savedName = file.filename;
    profileImage.fileType = FileType.PROFILE;

    profileImage = await this.fileRepository.save(profileImage);

    user.profileImage = profileImage;

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
