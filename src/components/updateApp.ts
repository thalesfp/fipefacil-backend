import { getBrands } from "../repository/brands";
import { getModels } from "../repository/models";
import { getYearModels } from "../repository/yearModels";
import VehicleType from "../types/VehicleType";
import {
  BrandsWithModelsType,
  ModelsWithYearModelsType,
  ReferenceDatabaseType,
} from "../types/DatabaseTypes";
import { compressStringToZip } from "../utils/compress";
import { saveUpdateFile } from "../storage/updates";
import { getCurrentReference } from "../repository/references";

const handler = async (
  currentReference: ReferenceDatabaseType,
  vehicleType: VehicleType,
): Promise<void> => {
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

  const fileName = `${vehicleType.toString()}-${currentReference.year}-${
    currentReference.month
  }.zip`;

  await saveUpdateFile(fileName, compressedBody);

  return;
};

export const updateApp = async (): Promise<void> => {
  const currentReference = await getCurrentReference();

  if (!currentReference) {
    throw Error("Reference not found");
  }

  const vehicleTypes = [
    VehicleType.car,
    VehicleType.motorcycle,
    VehicleType.trucks,
  ];

  for (const vehicleType of vehicleTypes) {
    await handler(currentReference, vehicleType);
  }

  return;
};
