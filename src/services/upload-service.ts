import multer from 'multer';
import { v4 } from 'uuid';

class UploadService {
  public storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
      cb(null, v4() + '-' + file.originalname);
    }
  });

  public uploadInApp = multer({
    dest: 'public/upload/',
    storage: this.storage,
    limits: { fileSize: 20 * 1024 * 1024 } //20 MB
  });

  public upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } //20 MB
  });
}

export default new UploadService();
