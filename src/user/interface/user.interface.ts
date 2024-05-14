import { File } from 'src/file/entities/file.entity';

export interface IUser {
  id?: number;
  email: string;
  mobile: string;
  username: string;
  password: string;
  isAdmin: boolean;
  profileImage: File;
}
