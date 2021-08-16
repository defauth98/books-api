import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(_request: any, file: { originalname: string; }, callback: (arg0: any, arg1: string) => void) {
      const hash = crypto.randomBytes(6).toString('hex');

      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);
    }
  }),
};