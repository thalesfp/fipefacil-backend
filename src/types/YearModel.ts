interface YearModel {
  pk: string;
  sk: string;
  year: number;
  fuelType: boolean;
  currentPrice: number;
  createdAt: Date;
  priceHistory: {};
}
