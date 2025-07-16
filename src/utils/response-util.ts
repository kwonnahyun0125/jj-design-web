import { ISuccessResponse, IErrorResponse } from '../types/response-type';

export const successResponse = <T>(data: T): ISuccessResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (status: number, message: string): IErrorResponse => ({
  success: false,
  error: {
    status,
    message,
  },
});
