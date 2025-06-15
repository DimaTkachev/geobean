import { Router } from 'express';

import {
  addCoffeeLotToInventory,
  createShop,
  deleteShop,
  generateShopQr,
  getGuestInventory,
  getInventoryItem,
  getShopInventory,
  getShops,
  removeFromInventory,
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
  updateInventoryItem,
);
router.delete(
  '/:shopID/inventory/:lotID',
  authenticateToken,
  removeFromInventory,
);
router.get('/:shopID/inventory', authenticateToken, getShopInventory);
router.post('/:shopID/generate-qr', authenticateToken, generateShopQr);
router.get('/guest-inventory/:shareUrl', getGuestInventory);

export default router;
