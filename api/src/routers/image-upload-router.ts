import { Router } from 'express';
import uploadToMemory from '../middlewares/multer';
import {
  uploadImages,
  getSignedUrlOne,
  getSignedUrlMany,
} from '../controllers/image-upload-controller';

const router = Router();

// 업로드(버퍼 업로드 → private 저장)
router.post('/images/upload', uploadToMemory.array('images'), uploadImages);

// 단건 프리사인드 GET
router.get('/images/signed-url', getSignedUrlOne);

// 다건 프리사인드 GET
router.post('/images/signed-urls', getSignedUrlMany);

export default router;
