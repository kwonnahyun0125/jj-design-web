import { RequestHandler } from 'express';
import { BadRequestError } from '../types/error-type';
import { successResponse } from '../utils/response-util';
import { randomUUID } from 'crypto';
import path from 'path';
import bucket from '../config/firebase-admin';

export const uploadImages: RequestHandler = async (req, res, next) => {
  try {
    // ✅ Firebase 비활성화 체크
    if (!bucket) {
      return res.status(503).json({ message: 'Firebase disabled' });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new BadRequestError('파일이 존재하지 않습니다.');
    }

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const { originalname, buffer, mimetype } = file;
        const extension = path.extname(originalname);
        const baseName = path.basename(originalname, extension);
        const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const timestamp = Date.now();
        const firebaseFileName = `${safeBaseName}_${timestamp}_${randomUUID()}${extension}`;
        const destination = `images/${firebaseFileName}`;

        // 파이어베이스에 파일 업로드
        const fileRef = bucket!.file(destination);
        await fileRef.save(buffer, {
          metadata: { contentType: mimetype },
        });

        // 파일 다운로드 URL 생성
        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: '09-03-2500',
        });

        return url;
      })
    );

    return res.status(200).json(successResponse(uploadedUrls));
  } catch (error) {
    next(error);
  }
};
