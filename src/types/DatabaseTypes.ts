export interface ReferenceDatabaseType {
  pk: string;
  sk: string;
  month: number;
  year: number;
  createdAt: Date;
}

export interface BrandDatabaseType {
  pk: number;
  sk: string;
  name: string;
  popular: boolean;
  createdAt: Date;
}

export interface ModelDatabaseType {
  pk: string;
  sk: string;
  name: string;
  createdAt: Date;
}

export interface YearModelDatabaseType {
  pk: string;
  sk: string;
  year: number;
  fuelType: boolean;
  currentPrice: number;
  createdAt: Date;
  priceHistory: { [key: string]: number };
}

export interface ModelsWithYearModelsType extends ModelDatabaseType {
  yearModels?: Pick<
    YearModelDatabaseType,
    "year" | "fuelType" | "currentPrice" | "priceHistory"
  >[];
}

export interface BrandsWithModelsType extends BrandDatabaseType {
  models?: ModelsWithYearModelsType[];
}

export type BrandUpdate = Partial<Pick<BrandDatabaseType, "name" | "popular">>;
