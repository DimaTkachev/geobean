import { Response } from 'express';

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
  res: Response
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
      `CoffeeLot ${coffeeLotID} added/updated in inventory for Shop ${shopID}`
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
  res: Response
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
  res: Response
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
  res: Response
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
