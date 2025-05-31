import { Response } from 'express';

import { AuthenticatedRequest } from '../middleware/auth';
import { CoffeeLot, Roasting, Supplier, Weight } from '../models'; // Assuming these models exist

export const getCoffeeLots = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    // Fetch coffee lots and include related data
    const coffeeLots = await CoffeeLot.findAll({
      attributes: ['lotID', 'name', 'image'], // Select required fields, use 'lotID' and 'image'
      include: [
        { model: Roasting, attributes: ['name'] }, // Include Roasting name
        { model: Weight, attributes: ['value'] }, // Include Weight value (remove unit)
        { model: Supplier, attributes: ['name'] }, // Include Supplier name
      ],
    });

    // Format the data to match the frontend's expected structure
    const formattedCoffeeLots = coffeeLots.map((lot) => ({
      coffeeLotID: lot.lotID, // Use 'lotID' from the model
      name: lot.name,
      roasting: lot.Roasting?.name, // Access included model data
      weight: lot.Weight?.value, // Access the value property directly
      supplier: lot.Supplier?.name, // Access included model data
      imageFilename: lot.image, // Use 'image' from the model and rename to 'imageFilename'
    }));

    res.json(formattedCoffeeLots);
  } catch (error) {
    console.error('Error fetching coffee lots:', error);
    res.status(500).json({ message: 'Failed to fetch coffee lots', error });
  }
};
