import express from 'express';
import { handleGetHealthCheck } from '../controllers/root-controller';

// ROUTER 는 ENDPOINT 의 이름을 따릅니다.
// ROOT 는 단 하나의 ENDPOINT 자체가 보통 ROOT 로 사용되어서 단수입니다.
// 다른 ENDPOINT 들은 PORTFOLIOS 처럼 복수형으로 쓰면 됩니다.
// '-Router' 를 붙일까 하다가,
// 다른 프로젝트들을 보니 portfolios.get 으로 직관적으로 쓰는 경우가 많아서 따라했습니다.
// 대신 APP.TS 에서 불러올 때엔 rootRouter 로 불러오면 됩니다.

const root = express.Router();

root.get('/', handleGetHealthCheck);

export default root;
