import { RequestHandler } from 'express';
import { BadRequestError } from '../types/error-type';
import { successResponse } from '../utils/response-util';
import { randomUUID } from 'crypto';
import path from 'path';
import { uploadBufferToS3, toPublicUrl } from '../config/s3';

export const uploadImages: RequestHandler = async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new BadRequestError('파일이 존재하지 않습니다.');
    }

    const urls = await Promise.all(
      files.map(async (file) => {
        const { originalname, buffer, mimetype } = file;

        const ext = path.extname(originalname) || '';
        const base = path.basename(originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_') || 'file';
        const key = `images/${base}_${Date.now()}_${randomUUID()}${ext}`;

        // S3 업로드 (공개 읽기)
        await uploadBufferToS3(key, buffer, mimetype);

        // 만료 없는 퍼블릭 URL 반환
        const url = toPublicUrl(key);
        return url;
      })
    );

    return res.status(200).json(successResponse(urls));
  } catch (err) {
    next(err);
  }
};
