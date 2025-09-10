import { CookieOptions, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Payload } from '../types/payload-type';
import { InternalServerError } from '../types/error-type';
import ENV from './env-util';
import { CookieType } from '../enums/cookie-type-enum';

// ACCESS_TOKEN 생성
export const generateAccessToken = (payload: Payload): string => {
  const { iat, exp, ...other } = payload;
  const expiresIn = `${ENV.accessExpiryValue}${ENV.accessExpiryUnit}`;

  return jwt.sign(other, ENV.accessSecretKey, { expiresIn } as jwt.SignOptions);
};

// REFRESH_TOKEN 생성
export const generateRefreshToken = (payload: Payload): string => {
  const { iat, exp, ...other } = payload;
  const expiresIn = `${ENV.refreshExpiryValue}${ENV.refreshExpiryUnit}`;

  return jwt.sign(other, ENV.refreshSecretKey, { expiresIn } as jwt.SignOptions);
};

// ACCESS_TOKEN 검증
export const verifyAccessToken = (token: string): Payload => {
  return jwt.verify(token, ENV.accessSecretKey) as Payload;
};

// REFRESH_TOKEN 검증
export const verifyRefreshToken = (token: string): Payload => {
  return jwt.verify(token, ENV.refreshSecretKey) as Payload;
};

// ACCESS_TOKEN GET/SET/DELETE
export const setAccessToken = (res: Response, token: string, options: CookieOptions) =>
  res.cookie(CookieType.Access, token, options);
export const getAccessToken = (req: Request) => {
  // 쿠키에 있는 토큰
  const tokenFromCookie = req.cookies?.[CookieType.Access];

  // Authorization 헤더
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  return tokenFromCookie || tokenFromHeader;
};
export const deleteAccessToken = (res: Response) => res.clearCookie(CookieType.Access);

// REFRESH_TOKEN GET/SET/DELETE
export const setRefreshToken = (res: Response, token: string, options: CookieOptions) =>
  res.cookie(CookieType.Refresh, token, options);
export const getRefreshToken = (req: Request) => {
  // 쿠키에 있는 토큰
  const tokenFromCookie = req.cookies?.[CookieType.Refresh];

  // Authorization 헤더
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  return tokenFromCookie || tokenFromHeader;
};
export const deleteRefreshToken = (res: Response) => res.clearCookie(CookieType.Refresh);

// 남은 토큰 기간 확인
export const getTokenRemainSeconds = (token: string): number => {
  const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  if (!decoded) {
    throw new InternalServerError('invalid token: decode failed');
  }

  const { exp } = decoded;
  if (typeof exp !== 'number') {
    throw new InternalServerError('invalid token: missing exp');
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return exp - nowInSeconds;
};
