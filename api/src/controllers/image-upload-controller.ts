import { RequestHandler } from 'express';
import { BadRequestError } from '../types/error-type';
import { successResponse } from '../utils/response-util';
import { randomUUID } from 'crypto';
import path from 'path';
import { uploadBufferToS3, toPublicUrl } from '../config/s3';

export const uploadImages: RequestHandler = async (req, res, next) => {
  try {
    // ① 라우터에서 flattenFiles를 못 쓴 경우 대비(Record<string, File[]> 형태도 수용)
    let files: Express.Multer.File[] = Array.isArray(req.files)
      ? (req.files as Express.Multer.File[])
      : Object.values(
          (req.files as Record<string, Express.Multer.File[]> | undefined) ?? {}
        ).flat();

    if (!files || files.length === 0) {
      throw new BadRequestError('파일이 존재하지 않습니다.');
    }

    // ② 이미지 MIME만 허용(원하면 제거 가능)
    files = files.filter((f) => /^image\//.test(f.mimetype));
    if (files.length === 0) {
      throw new BadRequestError('이미지 파일만 업로드할 수 있습니다.');
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const { originalname, buffer, mimetype } = file;

        const ext = path.extname(originalname) || '';
        const base =
          path
            .basename(originalname, ext)
            .normalize('NFKD')
            .replace(/[^a-zA-Z0-9_.-]/g, '_') || 'file';
        const key = `images/${base}_${Date.now()}_${randomUUID()}${ext}`;

        // S3 업로드: ❗ ACL 사용 금지 (Block Public Access와 충돌)
        await uploadBufferToS3(key, buffer, mimetype); // 내부에서 SSE(AES256)만 지정 권장

        return toPublicUrl(key); // https://<bucket>.s3.<region>.amazonaws.com/<key>
      })
    );

    return res.status(200).json(successResponse(urls));
  } catch (err) {
    next(err);
  }
};
