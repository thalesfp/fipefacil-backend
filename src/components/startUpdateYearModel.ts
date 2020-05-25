import { getYearModel } from "../api/fipeApi";
import {
  createYearModel,
  updateYearModelCurrentPrice,
} from "../repository/yearModels";
import { normalizeYearModel } from "../transformers/valuesFromRemoteApi";
import VehicleType from "../types/VehicleType";
import FuelType from "../types/FuelType";

const startUpdateYearModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  yearModelId: string;
  yearModelYear: number;
  yearModelFuelType: FuelType;
}): Promise<void> => {
  await createYearModel({
    id: yearModelId,
    year: yearModelYear,
    fuelType: yearModelFuelType,
    modelId,
  });

  const yearModelDetails = await getYearModel({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelYear,
    yearModelFuelType,
  });

  const yearModelNormalized = normalizeYearModel(yearModelDetails);

  await updateYearModelCurrentPrice({
    modelId,
    yearModelId,
    currentPrice: yearModelNormalized.value,
    year: yearModelNormalized.reference.year,
    month: yearModelNormalized.reference.month,
  });
};

export default startUpdateYearModel;
