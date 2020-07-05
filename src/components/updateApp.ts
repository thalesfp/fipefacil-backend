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
import { saveUpdateFile, listUpdateFiles } from "../storage/updates";
import { getCurrentReference } from "../repository/references";

const generateFileName = (
  currentReference: ReferenceDatabaseType,
  vehicleType: VehicleType,
): string =>
  `${vehicleType.toString()}-${currentReference.year}-${
    currentReference.month
  }.zip`;

const handler = async (
  fileName: string,
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

  const updateFiles = await listUpdateFiles();

  for (const vehicleType of vehicleTypes) {
    const fileName = generateFileName(currentReference, vehicleType);

    if (!updateFiles.includes(fileName)) {
      await handler(fileName, vehicleType);
    }
  }

  return;
};
