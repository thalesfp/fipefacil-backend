import { BrandDatabaseType } from "../types/DatabaseTypes";
import VehicleType from "../types/VehicleType";
import { BrandUpdate } from "../types/DatabaseTypes";
import * as repository from "../repository/brandRepository";

export async function updateBrand(
  vehicleType: VehicleType,
  brandId: number,
  brand: BrandUpdate,
): Promise<BrandDatabaseType | null> {
  const updatedBrand = await repository.updateBrand(
    vehicleType,
    brandId,
    brand,
  );

  return updatedBrand;
}
