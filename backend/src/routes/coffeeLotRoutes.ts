import { Router } from 'express';

import { getCoffeeLots } from '../controllers/coffeeLotController';
import { authenticateToken } from '../middleware/auth'; // Assuming authenticateToken is needed

const router = Router();

// GET /api/coffee-lots
router.get('/', authenticateToken, getCoffeeLots);

export default router;
