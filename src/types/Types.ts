interface ReferenceType {
  month: number;
  year: number;
  id: number;
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
