import express from 'express';
import env from './utils/env-util';
import { listenHandler } from './handlers/listen-handler';
import { globalErrorHandler } from './handlers/global-error-handler';
import { notFoundHandler } from './handlers/not-found-handler';
import rootRouter from './routers/root-router';
import projectRouter from './routers/projects-router';
import imageUploadRouter from './routers/image-upload-route';

const app = express();

// PRE MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTERS
app.use(rootRouter);
app.use(projectRouter);
app.use(imageUploadRouter);

// POST MIDDLEWARE
app.use(notFoundHandler); // 생성되지 않은 엔드포인트로 접근 시 404 처리
app.use(globalErrorHandler); // 에러를 처리하는 글로벌 에러 핸들러

// LISTEN
app.listen(env.port, listenHandler);
