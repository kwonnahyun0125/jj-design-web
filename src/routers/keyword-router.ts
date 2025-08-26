import { Router } from 'express';
import { getKeywordList } from '../controllers/keyword-controller';

const router = Router();

router.get('/keywords', getKeywordList);

export default router;
