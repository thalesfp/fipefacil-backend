import { getBrands } from "./brands";
import { getModels } from "./models";
import { getYearModels } from "./yearModels";
import VehicleType from "../types/VehicleType";
import {
  BrandsWithModelsType,
  ModelsWithYearModelsType,
} from "../types/DatabaseTypes";
import { compressStringToZip } from "../utils/compress";
import { saveUpdateFile } from "../storage/updates";

export const updateApp = async (
  vehicleType: VehicleType,
): Promise<BrandsWithModelsType[]> => {
  const brands: BrandsWithModelsType[] = await getBrands(vehicleType);

  for (const brand of brands) {
    const brandId = parseInt(brand.sk.split("#")[1]);
    const models: ModelsWithYearModelsType[] = await getModels(brandId);

    brand.models = models;

    for (const model of models) {
      const modelId = parseInt(model.sk.split("#")[1]);
      const yearModels = await getYearModels(modelId);

      model.yearModels = yearModels;
    }
  }

  const compressedBody = compressStringToZip(JSON.stringify(brands));

  await saveUpdateFile("car.zip", compressedBody);

  return brands;
};
