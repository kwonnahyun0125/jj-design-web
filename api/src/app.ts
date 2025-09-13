import express from 'express';
import env from './utils/env-util';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { listenHandler } from './handlers/listen-handler';
import { globalErrorHandler } from './handlers/global-error-handler';
import { notFoundHandler } from './handlers/not-found-handler';
import rootRouter from './routers/root-router';
import projectRouter from './routers/projects-router';
import imageUploadRouter from './routers/image-upload-router';
import authRouter from './routers/auth-router';
import consultingRouter from './routers/consultings-router';
import noticeRouter from './routers/notice-router';
import showroomRouter from './routers/showroom.router';
import companyRouter from './routers/company.router';
import furnitureRouter from './routers/furniture.router';

const app = express();

// PRE MIDDLEWARE
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTERS
app.use(rootRouter);
app.use('/projects', projectRouter);
app.use('/api', imageUploadRouter);
app.use(authRouter);
app.use('/consultings', consultingRouter);
app.use(noticeRouter);
app.use(showroomRouter);
app.use('/company', companyRouter);
app.use(furnitureRouter);

// POST MIDDLEWARE
app.use(notFoundHandler); // 생성되지 않은 엔드포인트로 접근 시 404 처리
app.use(globalErrorHandler); // 에러를 처리하는 글로벌 에러 핸들러

// LISTEN
app.listen(env.port, listenHandler);
