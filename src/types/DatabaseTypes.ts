interface ReferenceDatabaseType {
  pk: string;
  sk: string;
  month: number;
  year: number;
  createdAt: Date;
}

interface BrandDatabaseType {
  pk: number;
  sk: string;
  name: string;
  popular: boolean;
  createdAt: Date;
}

interface ModelDatabaseType {
  pk: string;
  sk: string;
  name: string;
  createdAt: Date;
}

interface YearModelDatabaseType {
  pk: string;
  sk: string;
  year: number;
  fuelType: boolean;
  currentPrice: number;
  createdAt: Date;
  priceHistory: { [key: string]: number };
}
