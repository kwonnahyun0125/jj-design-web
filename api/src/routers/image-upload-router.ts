import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { uploadImages } from '../controllers/image-upload-controller';

const router = Router();

/**
 * Multer 설정: 메모리 저장 + 업로드 제한
 * - nginx client_max_body_size(50M)와 맞춤
 * - 동시에 최대 20개까지 허용
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 20,
  },
});

/**
 * 프론트 호환:
 * - 현재 프론트는 필드명을 'images'로 보내고 있음
 * - 권장 필드명은 'file'
 * 둘 다 수용하기 위해 fields로 받고, 컨트롤러에 넘기기 전에 배열로 평탄화한다.
 */
const acceptFields = upload.fields([
  { name: 'file', maxCount: 20 },
  { name: 'images', maxCount: 20 },
]);

/** fields 형태(req.files: Record<string, File[]>)를 배열 형태로 평탄화 */
function flattenFiles(req: Request, _res: Response, next: NextFunction) {
  const anyReq = req as Request & {
    files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>;
    file?: Express.Multer.File;
  };

  // 이미 array 형태면 그대로 통과
  if (Array.isArray(anyReq.files)) return next();

  const buckets = (anyReq.files || {}) as Record<string, Express.Multer.File[]>;
  const list: Express.Multer.File[] = [];

  for (const k of ['file', 'images']) {
    if (Array.isArray(buckets[k])) list.push(...buckets[k]);
  }

  // 단일 업로드(req.file) 대응
  if (!list.length && anyReq.file) list.push(anyReq.file as Express.Multer.File);

  anyReq.files = list;
  return next();
}

/**
 * 라우트 경로 주의:
 * - app.use('/api', router) 로 마운트되어 있다면 아래 경로로 /api/images/upload 가 완성됨.
 * - 루트에 마운트하면 '/api/images/upload'로 바꿔주세요.
 */
router.post('/images/upload', acceptFields, flattenFiles, uploadImages);

/** Multer 에러(사이즈 초과 등)는 400으로 명확히 반환 */
router.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    return res.status(400).json({
      success: false,
      code: err.code, // 예: LIMIT_FILE_SIZE, LIMIT_FILE_COUNT
      message: err.message,
    });
  }
  return next(err);
});

export default router;
