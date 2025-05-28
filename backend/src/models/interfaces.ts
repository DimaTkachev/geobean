import { Model } from 'sequelize';

export interface IMarker {
    id?: number;
    latitude: number | null;
    longitude: number | null;
    coffee_lot_id: number;
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
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISupplier {
    supplierID?: number;
    name: string;
    url: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Model interfaces with Sequelize Model
export interface MarkerModel extends Model<IMarker>, IMarker {}
export interface CoffeeLotModel extends Model<ICoffeeLot>, ICoffeeLot {}
export interface RegionModel extends Model<IRegion>, IRegion {}
export interface CountryModel extends Model<ICountry>, ICountry {}
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
