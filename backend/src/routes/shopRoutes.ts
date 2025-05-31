import { Router } from 'express';

import {
  addCoffeeLotToInventory,
  createShop,
  deleteShop,
  getShops,
  updateShop,
} from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createShop);
router.get('/', authenticateToken, getShops);
router.put('/:shopID', authenticateToken, updateShop);
router.delete('/:shopID', authenticateToken, deleteShop);
router.post('/:shopID/inventory', authenticateToken, addCoffeeLotToInventory);

export default router;
