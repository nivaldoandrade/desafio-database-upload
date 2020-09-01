import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const folderTmp = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: folderTmp,
  storage: multer.diskStorage({
    destination: folderTmp,
    filename(request, file, callback) {
      const filenameHash = crypto.randomBytes(10).toString('hex');
      const filename = `${filenameHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
