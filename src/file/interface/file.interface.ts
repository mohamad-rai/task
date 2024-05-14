import { User } from 'src/user/entities/user.entity';

export interface IFile {
  id?: number;
  originalName: string;
  savedName: string;
  fileType: FileType;
  creator: User;
}

export enum FileType {
  'PROFILE' = 'PROFILE',
  'ATTACHMENT' = 'ATTACHMENT',
}
