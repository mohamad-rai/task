import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { hash } from 'src/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async signUp(user: CreateUserDto) {
    const isUserExists = await this.userRepository.findOne({
      where: [
        { email: user.email },
        { username: user.username },
        { mobile: user.mobile },
      ],
    });
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

  async login(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      profile: user.profileImage,
      admin: user.isAdmin,
    };

    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
