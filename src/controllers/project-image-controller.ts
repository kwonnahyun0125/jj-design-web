import { RequestHandler } from 'express';
import { ProjectImageService } from '../services/project-image-service';
import { successResponse } from '../utils/response-util';

const projectImageService = new ProjectImageService();

// 프로젝트에 이미지 등록
export const createProjectImage: RequestHandler = async (req, res, next) => {
  try {
    const { projectId, imageUrl } = req.body;

    const result = await projectImageService.createProjectImage(projectId, imageUrl);
    res.status(201).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

// 이미지 삭제
export const deleteProjectImage: RequestHandler = async (req, res, next) => {
  try {
    const projectImageId = Number(req.params.id);
    const result = await projectImageService.deleteProjectImage(projectImageId);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

// 키워드 업데이트
export const updateProjectImageKeywords: RequestHandler = async (req, res, next) => {
  try {
    const projectImageId = Number(req.params.id);
    const { keywordIds } = req.body;

    const result = await projectImageService.updateProjectImageKeywords(projectImageId, keywordIds);
    res.status(200).json(successResponse(result));
  } catch (error) {
    next(error);
  }
};
