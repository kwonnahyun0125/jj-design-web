import { RequestHandler } from 'express';
import path from 'path';
import { randomUUID } from 'crypto';
import { BadRequestError } from '../types/error-type';
import { successResponse } from '../utils/response-util';
import { uploadBufferToS3, getSignedGetUrl } from '../config/s3';

// 업로드: key만 반환
export const uploadImages: RequestHandler = async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (!files.length) throw new BadRequestError('파일이 존재하지 않습니다.');

    const results = await Promise.all(
      files.map(async (f) => {
        const ext = path.extname(f.originalname);
        const base = path.basename(f.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const key = `images/${base}_${Date.now()}_${randomUUID()}${ext}`;
        await uploadBufferToS3(key, f.buffer, f.mimetype);
        return { key, mime: f.mimetype, size: f.size };
      })
    );

    res.json(successResponse(results));
  } catch (e) {
    next(e);
  }
};

// 단건 프리사인드 GET
export const getSignedUrlOne: RequestHandler = async (req, res, next) => {
  try {
    const key = String(req.query.key || '');
    const ttl = Number(req.query.ttl || 3600); // 기본 1시간
    if (!key) throw new BadRequestError('key가 필요합니다.');
    const url = await getSignedGetUrl(key, ttl);
    res.json(successResponse({ key, url }));
  } catch (e) {
    next(e);
  }
};

// 다건 프리사인드 GET
export const getSignedUrlMany: RequestHandler = async (req, res, next) => {
  try {
    const keys: string[] = Array.isArray(req.body?.keys) ? req.body.keys : [];
    const ttl = Number(req.body?.ttl ?? 3600);
    if (!keys.length) throw new BadRequestError('keys 배열이 필요합니다.');

    const out = await Promise.all(
      keys.map(async (key) => {
        const url = await getSignedGetUrl(String(key), ttl);
        return { key, url };
      })
    );

    res.json(successResponse(out));
  } catch (e) {
    next(e);
  }
};
