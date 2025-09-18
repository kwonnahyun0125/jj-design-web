import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { uploadImages } from '../controllers/image-upload-controller';

const router = Router();

// 메모리 스토리지 + 업로드 제한(사이즈/개수)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // ✅ 50MB (nginx client_max_body_size와 맞춤)
    files: 20, // 필요시 조정
  },
});

/**
 * 마운트 방식에 따라 라우트 경로 선택:
 * - app.use('/api', router) 로 마운트했다면 → router.post('/images/upload', ...)
 * - app.use('/', router) 등 접두어가 없다면 → router.post('/api/images/upload', ...)
 *
 * 현재 nginx가 /api 접두어를 유지해 프록시하므로,
 * 보통은 app.use('/api', router) + 아래처럼 '/images/upload'를 쓰면 /api/images/upload로 매칭됩니다.
 */

// 단일/다중 업로드: 프론트는 FormData에 'file' 이름으로 append 하세요.
router.post('/images/upload', upload.array('file', 20), uploadImages);

// Multer 에러를 400으로 명확히 내려서 원인(사이즈 초과 등) 바로 파악
router.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    return res.status(400).json({ success: false, code: err.code, message: err.message });
  }
  return next(err);
});

export default router;
