import { Request } from 'express';
import { Payload } from '../types/payload-type';
import { UnauthorizedError } from '../types/error-type';

export const getUser = (req: Request): Payload => {
  const user = req.user;
  if (user !== undefined) {
    return user;
  }
  throw new UnauthorizedError();
};
export const setUser = (req: Request, user: Payload): Payload => (req.user = user);
export const isUserAdmin = (user: Payload): boolean => user.isAdmin;
