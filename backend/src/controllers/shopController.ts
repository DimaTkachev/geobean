import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

import { AuthenticatedRequest } from '../middleware/auth';
import { Inventory, Shop } from '../models';

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

export const deleteShop = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { userID } = req.user;
    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    await Inventory.destroy({ where: { shopID } });
    await shop.destroy();
    res.json({ message: 'Shop deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shop', error });
  }
};

export const addCoffeeLotToInventory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { coffeeLotID, quantity } = req.body;
    const { userID } = req.user;

    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) {
      return res
        .status(404)
        .json({ message: 'Shop not found or does not belong to user' });
    }

    const [inventoryItem, created] = await Inventory.findOrCreate({
      where: {
        shopID: parseInt(shopID, 10),
        lotID: coffeeLotID,
      },
      defaults: {
        shopID: parseInt(shopID, 10),
        lotID: coffeeLotID,
        stock: quantity,
      },
    });

    if (!created) {
      await inventoryItem.increment('stock', { by: quantity });
    }

    console.log(
      `CoffeeLot ${coffeeLotID} added/updated in inventory for Shop ${shopID}`,
    );

    res.status(200).json({ message: 'Кофе добавлен в инвентарь!' });
  } catch (error) {
    console.error('Error adding coffee lot to inventory:', error);
    res
      .status(500)
      .json({ message: 'Failed to add coffee lot to inventory', error });
  }
};

export const getInventoryItem = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID, lotID } = req.params;
    const { userID } = req.user;

    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) {
      return res
        .status(404)
        .json({ message: 'Shop not found or does not belong to user' });
    }

    const inventoryItem = await Inventory.findOne({
      where: {
        shopID: parseInt(shopID, 10),
        lotID: parseInt(lotID, 10),
      },
    });

    if (!inventoryItem) {
      return res.json({ stock: 0 });
    }

    res.json({ stock: inventoryItem.stock });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'Failed to fetch inventory item', error });
  }
};

export const updateInventoryItem = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID, lotID } = req.params;
    const { stock } = req.body;
    const { userID } = req.user;

    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) {
      return res
        .status(404)
        .json({ message: 'Shop not found or does not belong to user' });
    }

    if (stock === 0) {
      await Inventory.destroy({
        where: {
          shopID: parseInt(shopID, 10),
          lotID: parseInt(lotID, 10),
        },
      });
    } else {
      const [inventoryItem] = await Inventory.findOrCreate({
        where: {
          shopID: parseInt(shopID, 10),
          lotID: parseInt(lotID, 10),
        },
        defaults: {
          shopID: parseInt(shopID, 10),
          lotID: parseInt(lotID, 10),
          stock,
        },
      });

      if (inventoryItem.stock !== stock) {
        await inventoryItem.update({ stock });
      }
    }

    res.json({ message: 'Inventory updated successfully', stock });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Failed to update inventory item', error });
  }
};

export const getShopInventory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { userID } = req.user;
    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) {
      return res
        .status(404)
        .json({ message: 'Shop not found or does not belong to user' });
    }
    const inventory = await Inventory.findAll({
      where: { shopID },
      attributes: ['lotID', 'stock'],
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get inventory', error });
  }
};

// Generate or regenerate shareUrl and QR code for a shop (authenticated)
export const generateShopQr = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  if (!req.user) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { shopID } = req.params;
    const { userID } = req.user;
    console.log('Generating QR for shopID:', shopID, 'userID:', userID);

    const shop = await Shop.findOne({ where: { shopID, userID } });
    if (!shop) {
      console.error('Shop not found or does not belong to user', {
        shopID,
        userID,
      });
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Generate a new shareUrl and QR code
    const shareUrl = nanoid(16);
    const guestUrl = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/guest-inventory/${shareUrl}`;
    console.log('Generated guestUrl:', guestUrl);

    const qrBase64 = await QRCode.toDataURL(guestUrl);
    console.log('Generated qrBase64 length:', qrBase64.length);

    await shop.update({ shareUrl, qrBase64, qrEnabled: true });
    console.log('Shop updated with new QR');

    res.json({ shareUrl, qrBase64, guestUrl });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({ message: 'Failed to generate QR code', error });
  }
};

// Public endpoint: get shop inventory by shareUrl (no auth)

export const getGuestInventory = async (req: Request, res: Response) => {
  try {
    const { shareUrl } = req.params;
    const shop = await Shop.findOne({ where: { shareUrl, qrEnabled: true } });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const inventory = await Inventory.findAll({
      where: { shopID: shop.shopID },
      attributes: ['lotID', 'stock'],
    });
    res.json({
      shop: { name: shop.name, theme: shop.theme },
      qrBase64: shop.qrBase64,
      inventory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get guest inventory', error });
  }
};
