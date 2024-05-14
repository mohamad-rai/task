import { File } from 'src/file/entities/file.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  isAdmin: boolean;
  profileImage: File;
}
