import { RequestHandler } from 'express';
import { NoticeService } from '../services/notice-service';
import { successResponse } from '../utils/response-util';

const noticeService = new NoticeService();

// 공지사항 등록
export const createNotice: RequestHandler = async (req, res, next) => {
  try {
    const data = await noticeService.createNotice(req.body);
    res.status(201).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};
// 공지사항 목록 조회
export const getNotices: RequestHandler = async (req, res, next) => {
  try {
    const data = await noticeService.getNotices(req.query);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

// 공지사항 목록 디테일
export const getNoticeDetail: RequestHandler = async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const data = await noticeService.getNoticeDetail(noticeId);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

// 공지사항 수정
export const updateNotice: RequestHandler = async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const data = await noticeService.updateNotice(noticeId, req.body);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

// 공지사항 삭제
export const deleteNotice: RequestHandler = async (req, res, next) => {
  try {
    const noticeId = Number(req.params.id);
    const data = await noticeService.deleteNotice(noticeId);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};
