import { Router } from 'express';
import multer from 'multer';
import { uploadImages } from '../controllers/image-upload-controller';

const router = Router();

// 메모리 스토리지 + 제한(사이즈, 개수)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // 최대 10개
  },
});

router.post('/images', upload.array('images', 10), uploadImages);

export default router;
