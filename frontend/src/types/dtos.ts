export interface MarkerDTO {
    markerID?: number;
    lotID: number;
    longitude: number | null;
    latitude: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CoffeeLotDTO {
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
    createdAt?: string;
    updatedAt?: string;
}

export interface RegionDTO {
    regionID?: number;
    name: string;
    countryID: number;
    description: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CountryDTO {
    countryID?: number;
    name: string;
    iso3: string;
    continentID: number;
    description: string | null;
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
    description: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProcessingMethodDTO {
    methodID?: number;
    name: string;
    description: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface TasteTagDTO {
    tagID?: number;
    name: string;
    description: string | null;
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
}

export interface SupplierDTO {
    supplierID?: number;
    name: string;
    url: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserDTO {
    userID?: number;
    email: string;
    passwordHash: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShopDTO {
    shopID?: number;
    userID: number;
    name: string;
    image: string | null;
    theme: 'beige' | 'purple' | 'blue';
    shareUrl: string | null;
    qrPath: string | null;
    qrEnabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface InventoryDTO {
    inventoryID?: number;
    shopID: number;
    lotID: number;
    stock: number;
    createdAt?: string;
    updatedAt?: string;
}
