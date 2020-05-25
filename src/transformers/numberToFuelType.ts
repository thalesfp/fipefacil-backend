import FuelType from "../types/FuelType";

export const numberToFuelType = (fuelType: number): FuelType => {
  switch (fuelType) {
    case 1:
      return FuelType.gasolina;
    case 2:
      return FuelType.alcool;
    case 3:
      return FuelType.diesel;
    default:
      throw new Error(`Invalid Fuel Type: ${fuelType}`);
  }
};
