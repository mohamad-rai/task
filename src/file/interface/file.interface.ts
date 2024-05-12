export interface IFile {
  id?: number;
  originalName: string;
  savedName: string;
  fileType: FileType;
  creator?: string;
}

export enum FileType {
  'PROFILE' = 'PROFILE',
  'ATTACHMENT' = 'ATTACHMENT',
}
