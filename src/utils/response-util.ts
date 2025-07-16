import { TSuccessResponse, TErrorResponse } from '../types/response-type';

export const successResponse = <T>(data: T): TSuccessResponse<T> => ({
  success: true,
  data,
});

export const errorResponse = (status: number, message: string): TErrorResponse => ({
  success: false,
  error: {
    status,
    message,
  },
});
