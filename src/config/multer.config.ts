import { diskStorage } from 'multer';
import { extname } from 'path';
import { UPLOAD_PATH } from 'src/common/const';

export const multerStorageConfig = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, UPLOAD_PATH);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = extname(file.originalname);
      const filename = `${uniqueSuffix}${extension}`;
      callback(null, filename);
    },
  }),
};
