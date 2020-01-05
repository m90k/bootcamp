import Multer from 'multer';
import Crypto from 'crypto';
import { resolve, extname } from 'path';

export default {
  storage: Multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'Uploads'),
    filename: (req, file, cb) => {
      Crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
