import FuelType from "./FuelType";

export interface PriceReferenceType {
  id: number;
  month: number;
  year: number;
}

export interface BrandType {
  id: number;
  name: string;
}

export interface ModelType {
  id: number;
  name: string;
}

export interface YearModelType {
  id: string;
  year: number;
  fuelType: FuelType;
}
