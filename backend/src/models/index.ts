import { sequelize } from '../config/sequelize';
import { DataTypes } from 'sequelize';
import {
    MarkerModel,
    CoffeeLotModel,
    RegionModel,
    CountryModel,
    ContinentModel,
    RoastingModel,
    ProcessingMethodModel,
    TasteTagModel,
    WeightModel,
    CoffeeLotTagModel,
    SupplierModel,
} from './interfaces';

// Define models
const Marker = sequelize.define<MarkerModel>(
    'Marker',
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: true,
        },
        coffee_lot_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: 'markers',
        timestamps: true,
    }
);

const CoffeeLot = sequelize.define<CoffeeLotModel>(
    'CoffeeLot',
    {
        lotID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        regionID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        taste: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tasteFilter: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        qRate: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        roastingID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        methodID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        supplierID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        height: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        weightID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
    },
    {
        tableName: 'coffee_lot',
        timestamps: true,
    }
);

const Region = sequelize.define<RegionModel>(
    'Region',
    {
        regionID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        countryID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'region',
        timestamps: true,
    }
);

const Country = sequelize.define<CountryModel>(
    'Country',
    {
        countryID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        iso3: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        continentID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'country',
        timestamps: true,
    }
);

const Continent = sequelize.define<ContinentModel>(
    'Continent',
    {
        continentID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        tableName: 'continent',
        timestamps: true,
    }
);

const Roasting = sequelize.define<RoastingModel>(
    'Roasting',
    {
        roastingID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'roasting',
        timestamps: true,
    }
);

const ProcessingMethod = sequelize.define<ProcessingMethodModel>(
    'ProcessingMethod',
    {
        methodID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'processing_method',
        timestamps: true,
    }
);

const TasteTag = sequelize.define<TasteTagModel>(
    'TasteTag',
    {
        tagID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'taste_tag',
        timestamps: true,
    }
);

const Weight = sequelize.define<WeightModel>(
    'Weight',
    {
        weightID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        value: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    },
    {
        tableName: 'weight',
        timestamps: true,
    }
);

const CoffeeLotTag = sequelize.define<CoffeeLotTagModel>(
    'CoffeeLotTag',
    {
        lotID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        tagID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
    },
    {
        tableName: 'coffee_lot_tag',
        timestamps: false,
    }
);

const Supplier = sequelize.define<SupplierModel>(
    'Supplier',
    {
        supplierID: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
    },
    {
        tableName: 'supplier',
        timestamps: true,
    }
);

// Define associations
Marker.belongsTo(CoffeeLot, {
    foreignKey: 'coffee_lot_id',
    targetKey: 'lotID',
});
CoffeeLot.hasOne(Marker, { foreignKey: 'coffee_lot_id', sourceKey: 'lotID' });

CoffeeLot.belongsTo(Region, { foreignKey: 'regionID', targetKey: 'regionID' });
Region.belongsTo(Country, { foreignKey: 'countryID', targetKey: 'countryID' });
Country.belongsTo(Continent, {
    foreignKey: 'continentID',
    targetKey: 'continentID',
});

CoffeeLot.belongsTo(Roasting, {
    foreignKey: 'roastingID',
    targetKey: 'roastingID',
});
CoffeeLot.belongsTo(ProcessingMethod, {
    foreignKey: 'methodID',
    targetKey: 'methodID',
});
CoffeeLot.belongsTo(Weight, { foreignKey: 'weightID', targetKey: 'weightID' });
CoffeeLot.belongsTo(Supplier, {
    foreignKey: 'supplierID',
    targetKey: 'supplierID',
});

CoffeeLot.belongsToMany(TasteTag, {
    through: CoffeeLotTag,
    foreignKey: 'lotID',
    otherKey: 'tagID',
});
TasteTag.belongsToMany(CoffeeLot, {
    through: CoffeeLotTag,
    foreignKey: 'tagID',
    otherKey: 'lotID',
});

export {
    Marker,
    CoffeeLot,
    Region,
    Country,
    Continent,
    Roasting,
    ProcessingMethod,
    TasteTag,
    Weight,
    CoffeeLotTag,
    Supplier,
};
