import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneWithUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      profile: user.profileImageUrl,
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
