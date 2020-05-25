import FuelType from "./FuelType";

interface PriceReferenceType {
  id: number;
  month: number;
  year: number;
}

interface BrandType {
  id: number;
  name: string;
}

interface ModelType {
  id: number;
  name: string;
}

interface YearModelType {
  id: string;
  year: number;
  fuelType: FuelType;
}

export { PriceReferenceType, BrandType, ModelType, YearModelType };
