import type { Model } from 'sequelize';

export interface IMarker {
  markerID?: number;
  lotID: number;
  longitude: number | null;
  latitude: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICoffeeLot {
  lotID?: number;
  name: string | null;
  description: string | null;
  regionID: number;
  taste: string | null;
  tasteFilter: string | null;
  qRate: number | null;
  roastingID: number;
  methodID: number;
  supplierID: number;
  height: string | null;
  weightID: number;
  image: string | null;
  link: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRegion {
  regionID?: number;
  name: string;
  countryID: number;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICountry {
  countryID?: number;
  name: string;
  iso3: string;
  continentID: number;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContinent {
  continentID?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoasting {
  roastingID?: number;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProcessingMethod {
  methodID?: number;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITasteTag {
  tagID?: number;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWeight {
  weightID?: number;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICoffeeLotTag {
  lotID: number;
  tagID: number;
}

export interface ISupplier {
  supplierID?: number;
  name: string;
  url: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  userID?: number;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShop {
  shopID?: number;
  userID: number;
  name: string;
  image: string | null;
  theme: 'beige' | 'purple' | 'blue';
  shareUrl: string | null;
  qrPath: string | null;
  qrBase64: string | null;
  qrEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInventory {
  inventoryID?: number;
  shopID: number;
  lotID: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Model interfaces with Sequelize Model
export interface MarkerModel extends Model<IMarker>, IMarker {}
export interface CoffeeLotModel extends Model<ICoffeeLot>, ICoffeeLot {
  Roasting?: RoastingModel;
  Weight?: WeightModel;
  Supplier?: SupplierModel;
  Region?: RegionModel;
  ProcessingMethod?: ProcessingMethodModel;
  TasteTags?: TasteTagModel[];
}
export interface RegionModel extends Model<IRegion>, IRegion {
  Country?: CountryModel;
}
export interface CountryModel extends Model<ICountry>, ICountry {
  Continent?: ContinentModel;
}
export interface ContinentModel extends Model<IContinent>, IContinent {}
export interface RoastingModel extends Model<IRoasting>, IRoasting {}
export interface ProcessingMethodModel
  extends Model<IProcessingMethod>,
    IProcessingMethod {}
export interface TasteTagModel extends Model<ITasteTag>, ITasteTag {}
export interface WeightModel extends Model<IWeight>, IWeight {}
export interface CoffeeLotTagModel
  extends Model<ICoffeeLotTag>,
    ICoffeeLotTag {}
export interface SupplierModel extends Model<ISupplier>, ISupplier {}
export interface UserModel extends Model<IUser>, IUser {}
export interface ShopModel extends Model<IShop>, IShop {}
export interface InventoryModel extends Model<IInventory>, IInventory {
  CoffeeLot?: CoffeeLotModel;
}
