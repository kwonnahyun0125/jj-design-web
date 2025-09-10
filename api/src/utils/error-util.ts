import { HttpError } from '../types/error-type';

export const isErrorInstanceOfHttp = (error: unknown): error is HttpError =>
  error instanceof HttpError;
export const isErrorInstanceOfNode = (error: unknown): error is Error => error instanceof Error;

/*
 * 향후 DTO 와 데이터베이스 관련 에러 타입이 추가될 때 아래에 추가합니다.
 */
