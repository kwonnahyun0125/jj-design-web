import { RequestHandler } from 'express';
import { getHealthCheck } from '../services/root-service';
import { successResponse } from '../utils/response-util';

// CONTROLLER 는 [응답 분기] 를 담당합니다.
// 에러는 글로벌 에러 핸들러가 처리하기 때문에 성공만 작업하면 됩니다. :)

export const handleGetHealthCheck: RequestHandler = async (_req, res, _next) => {
  const data = getHealthCheck();

  res.status(200).json(successResponse(data));
};
