import { Request } from 'express';
import { getUserByUsercode } from '../repositories/auth-repository';
import { NotFoundError } from '../types/error-type';
import { comparePassword } from '../utils/password-util';
import { Payload } from '../types/payload-type';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token-util';

export const signin = async (req: Request) => {
  const { body } = req;
  const { usercode, password } = body;

  const user = await getUserByUsercode(usercode);
  if (user === null) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }

  const payload: Payload = {
    id: String(user.id),
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user: payload, accessToken, refreshToken };
};

export const refresh = async (req: Request) => {
  const { body } = req;
  const { refreshToken } = body;

  const payload = verifyRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
