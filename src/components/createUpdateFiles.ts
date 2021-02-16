import * as BrandRepository from "../repository/brand";
import * as ModelRepository from "../repository/model";
import * as YearModelRepository from "../repository/yearModel";
import * as ReferenceRepository from "../repository/reference";
import * as UpdateFileStorage from "../storage/updateFile";
import VehicleType from "../types/VehicleType";
import {
  BrandsWithModelsType,
  ModelsWithYearModelsType,
  ReferenceDatabaseType,
} from "../types/DatabaseTypes";
import * as Compress from "../utils/compress";

const generateFileName = (
  currentReference: ReferenceDatabaseType,
  vehicleType: VehicleType,
): string => `${currentReference.sk}-${vehicleType.toString()}.zip`;

const createUpdateFileForVehicleType = async (
  vehicleType: VehicleType,
  fileName: string,
): Promise<void> => {
  const brands: BrandsWithModelsType[] = await BrandRepository.getBrands(
    vehicleType,
  );

  for (const brand of brands) {
    const brandId = parseInt(brand.sk.split("#")[1]);
    const models: ModelsWithYearModelsType[] = await ModelRepository.getModels(
      brandId,
    );

    brand.models = models;

    for (const model of models) {
      const modelId = parseInt(model.sk.split("#")[1]);
      const yearModels = await YearModelRepository.getYearModels(modelId);

      model.yearModels = yearModels;
    }
  }

  const compressedBody = Compress.stringToZip(JSON.stringify(brands));

  await UpdateFileStorage.saveUpdateFile(fileName, compressedBody);

  return;
};

const createUpdateFiles = async (): Promise<void> => {
  const currentReference = await ReferenceRepository.getCurrentReference();

  if (!currentReference) {
    throw Error("Reference not found");
  }

  const vehicleTypes = [
    VehicleType.car,
    VehicleType.motorcycle,
    VehicleType.truck,
  ];

  const updateFiles = await UpdateFileStorage.listUpdateFiles();

  for (const vehicleType of vehicleTypes) {
    const fileName = generateFileName(currentReference, vehicleType);

    if (!updateFiles.includes(fileName)) {
      await createUpdateFileForVehicleType(vehicleType, fileName);
    }
  }

  return;
};

export default createUpdateFiles;
