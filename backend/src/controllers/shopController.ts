import { Response } from 'express';

import { AuthenticatedRequest } from '../middleware/auth';
import { Shop } from '../models';

// Create a new shop
export const createShop = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { name, image, theme } = req.body;
    const { userID } = req.user;
    const shop = await Shop.create({
      userID,
      name,
      image,
      theme,
      qrEnabled: false,
    });
    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shop', error });
  }
};

// Get all shops for the authenticated user
export const getShops = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { userID } = req.user;
    const shops = await Shop.findAll({ where: { userID } });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get shops', error });
  }
};

// Update a shop
export const updateShop = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { userID } = req.user;
    const { name, image, theme } = req.body;
    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    await shop.update({ name, image, theme });
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shop', error });
  }
};

// Delete a shop
export const deleteShop = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { userID } = req.user;
    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    await shop.destroy();
    res.json({ message: 'Shop deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shop', error });
  }
};
