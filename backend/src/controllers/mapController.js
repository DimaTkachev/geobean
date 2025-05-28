const {
    Marker,
    CoffeeLot,
    Region,
    Country,
    Continent,
    Roasting,
    ProcessingMethod,
    TasteTag,
    Weight,
} = require('../models');

exports.getAllMarkers = async (_req, res) => {
    try {
        const markers = await Marker.findAll({
            include: [
                {
                    model: CoffeeLot,
                    attributes: [
                        'lotID',
                        'name',
                        'image',
                        'qRate',
                        'tasteFilter',
                    ],
                    include: [
                        {
                            model: Region,
                            attributes: ['name'],
                            include: {
                                model: Country,
                                attributes: ['name'],
                                include: {
                                    model: Continent,
                                    attributes: ['name'],
                                },
                            },
                        },
                        {
                            model: Roasting,
                            attributes: ['name'],
                        },
                        {
                            model: Weight,
                            attributes: ['value'],
                        },
                        {
                            model: ProcessingMethod,
                            attributes: ['name'],
                        },
                        {
                            model: TasteTag,
                            through: { attributes: [] },
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            attributes: ['latitude', 'longitude'],
        });

        res.json(markers);
    } catch (error) {
        console.error('Error fetching map markers:', error);
        res.status(500).json({ error: 'Error accessing map markers' });
    }
};
