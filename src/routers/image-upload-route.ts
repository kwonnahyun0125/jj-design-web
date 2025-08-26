import { Router } from 'express';
import uploadToMemory from '../middlewares/multer';
import { uploadImages } from '../controllers/image-upload-controller';

const router = Router();

// 이미지 업로드
router.post('/images/upload', uploadToMemory.array('images'), uploadImages);

export default router;
