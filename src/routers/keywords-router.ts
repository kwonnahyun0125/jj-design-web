import { Router } from 'express';
import { getKeywords } from '../controllers/keywords-controller';

const router = Router();

router.get('/keywords', getKeywords);

export default router;
