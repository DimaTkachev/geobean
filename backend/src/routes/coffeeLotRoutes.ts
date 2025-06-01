import { Router } from 'express';

import {
  getAttributeInfo,
  getCoffeeLotById,
  getCoffeeLots,
} from '../controllers/coffeeLotController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCoffeeLots);
router.get('/attribute-info', getAttributeInfo);
router.get('/:lotID', getCoffeeLotById);

export default router;
