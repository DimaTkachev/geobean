import { Router } from 'express';

import {
  getAttributeInfo,
  getCoffeeLotById,
  getCoffeeLots,
  getFilterOptions,
} from '../controllers/coffeeLotController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCoffeeLots);
router.get('/filter-options', getFilterOptions);
router.get('/attribute-info', getAttributeInfo);
router.get('/:lotID', getCoffeeLotById);

export default router;
