import { Router } from 'express';

import {
  addCoffeeLotToInventory,
  createShop,
  deleteShop,
  getInventoryItem,
  getShops,
  updateInventoryItem,
  updateShop,
} from '../controllers/shopController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createShop);
router.get('/', authenticateToken, getShops);
router.put('/:shopID', authenticateToken, updateShop);
router.delete('/:shopID', authenticateToken, deleteShop);
router.post('/:shopID/inventory', authenticateToken, addCoffeeLotToInventory);
router.get('/:shopID/inventory/:lotID', authenticateToken, getInventoryItem);
router.patch(
  '/:shopID/inventory/:lotID',
  authenticateToken,
  updateInventoryItem
);

export default router;
