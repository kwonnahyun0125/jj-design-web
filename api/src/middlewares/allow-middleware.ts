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

    const user = setUser(req, payload);

    if (user && roles.includes(UserRole.User)) {
      return next();
    }

    throw new ForbiddenError();
  };
};
