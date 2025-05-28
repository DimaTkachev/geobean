import { Request, Response } from 'express';
import {
    Marker,
    CoffeeLot,
    Region,
    Country,
    Continent,
    Roasting,
    ProcessingMethod,
    TasteTag,
    Weight,
} from '../models';

export const getAllMarkers = async (req: Request, res: Response) => {
    try {
        // Set headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        const markers = await Marker.findAll({
            include: [
                {
                    model: CoffeeLot,
                    include: [
                        {
                            model: Region,
                            include: [
                                {
                                    model: Country,
                                    include: [Continent],
                                },
                            ],
                        },
                        Roasting,
                        Weight,
                        ProcessingMethod,
                        TasteTag,
                    ],
                },
            ],
        });
        res.status(200).json(markers);
    } catch (error) {
        console.error('Error fetching map markers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
