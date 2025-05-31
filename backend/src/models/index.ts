import { DataTypes } from 'sequelize';

import { sequelize } from '../config/sequelize';

import type {
  CoffeeLotModel,
  CoffeeLotTagModel,
  ContinentModel,
  CountryModel,
  InventoryModel,
  MarkerModel,
  ProcessingMethodModel,
  RegionModel,
  RoastingModel,
  ShopModel,
  SupplierModel,
  TasteTagModel,
  UserModel,
  WeightModel,
} from './interfaces';

const Marker = sequelize.define<MarkerModel>(
  'Marker',
  {
    markerID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    lotID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
  },
  {
    tableName: 'marker',
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

const User = sequelize.define<UserModel>(
  'User',
  {
    userID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

const Shop = sequelize.define<ShopModel>(
  'Shop',
  {
    shopID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    theme: {
      type: DataTypes.ENUM('beige', 'purple', 'blue'),
      defaultValue: 'beige',
    },
    shareUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qrPath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qrEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'shop',
    timestamps: true,
  }
);

const Inventory = sequelize.define<InventoryModel>(
  'Inventory',
  {
    inventoryID: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    shopID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    lotID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'inventory',
    timestamps: true,
  }
);

// Define relationships
Marker.belongsTo(CoffeeLot, { foreignKey: 'lotID' });
CoffeeLot.hasOne(Marker, { foreignKey: 'lotID' });

CoffeeLot.belongsTo(Region, { foreignKey: 'regionID' });
Region.hasMany(CoffeeLot, { foreignKey: 'regionID' });

Region.belongsTo(Country, { foreignKey: 'countryID' });
Country.hasMany(Region, { foreignKey: 'countryID' });

Country.belongsTo(Continent, { foreignKey: 'continentID' });
Continent.hasMany(Country, { foreignKey: 'continentID' });

CoffeeLot.belongsTo(Roasting, { foreignKey: 'roastingID' });
Roasting.hasMany(CoffeeLot, { foreignKey: 'roastingID' });

CoffeeLot.belongsTo(ProcessingMethod, { foreignKey: 'methodID' });
ProcessingMethod.hasMany(CoffeeLot, { foreignKey: 'methodID' });

CoffeeLot.belongsTo(Supplier, { foreignKey: 'supplierID' });
Supplier.hasMany(CoffeeLot, { foreignKey: 'supplierID' });

CoffeeLot.belongsTo(Weight, { foreignKey: 'weightID' });
Weight.hasMany(CoffeeLot, { foreignKey: 'weightID' });

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

Shop.belongsTo(User, { foreignKey: 'userID' });
User.hasMany(Shop, { foreignKey: 'userID' });

Inventory.belongsTo(Shop, { foreignKey: 'shopID' });
Shop.hasMany(Inventory, { foreignKey: 'shopID' });

Inventory.belongsTo(CoffeeLot, { foreignKey: 'lotID' });
CoffeeLot.hasMany(Inventory, { foreignKey: 'lotID' });

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
  User,
  Shop,
  Inventory,
};
