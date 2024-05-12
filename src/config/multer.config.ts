import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerStorageConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, './uploads');
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const filename = `${uniqueSuffix}${extension}`;
      callback(null, filename);
    },
  }),
};
