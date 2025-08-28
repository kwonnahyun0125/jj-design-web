import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../types/error-type';
import { setUser } from '../utils/user-util';
import { getAccessToken, verifyAccessToken } from '../utils/token-util';
import { UserRole } from '../enums/user-role-enum';

export const allow = (roles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // NONE
    if (roles.includes(UserRole.None)) {
      return next();
    }

    const accessToken = getAccessToken(req);

    // PUBLIC
    // 토큰이 없어도 되는 API 에 사용합니다.
    // 예: 회원가입
    if (accessToken === undefined) {
      if (roles.includes(UserRole.Public)) {
        return next();
      }
      throw new UnauthorizedError();
    }

    const payload = verifyAccessToken(accessToken);

    setUser(req, payload);

    // USER
    // 사용자만 사용하는 API 를 처리합니다.
    if (roles.includes(UserRole.User)) {
      return next();
    }

    throw new ForbiddenError();
  };
};
