import { RequestHandler } from 'express';
import KeywordService from '../services/keyword-service';

export const getKeywordList: RequestHandler = async (_req, res, next) => {
  try {
    const keywords = await KeywordService.getKeywordList();
    return res.status(200).json({ keywords });
  } catch (error) {
    next(error);
  }
};
