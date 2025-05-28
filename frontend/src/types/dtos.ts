export interface MarkerDTO {
    id?: number;
    latitude: null | null;
    longitude: null | null;
    coffee_lot_id: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CoffeeLotDTO {
    lotID?: number;
    name: null | null;
    description: null | null;
    regionID: number;
    taste: null | null;
    tasteFilter: null | null;
    qRate: null | null;
    roastingID: number;
    methodID: number;
    supplierID: number;
    height: null | null;
    weightID: number;
    image: null | null;
    link: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface RegionDTO {
    regionID?: number;
    name: string;
    countryID: number;
    description: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CountryDTO {
    countryID?: number;
    name: string;
    iso3: string;
    continentID: number;
    description: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContinentDTO {
    continentID?: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RoastingDTO {
    roastingID?: number;
    name: string;
    description: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProcessingMethodDTO {
    methodID?: number;
    name: string;
    description: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface TasteTagDTO {
    tagID?: number;
    name: string;
    description: null | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface WeightDTO {
    weightID?: number;
    value: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CoffeeLotTagDTO {
    lotID: number;
    tagID: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SupplierDTO {
    supplierID?: number;
    name: string;
    url: null | null;
    createdAt?: string;
    updatedAt?: string;
}
