import * as FipeApi from "../services/fipeApi";
import * as YearModelRepository from "../repository/yearModelRepository";
import { normalizeYearModel } from "../transformers/valuesFromRemoteApi";
import { YearModelQueueMessage } from "../queue/yearModelQueue";

const startUpdateYearModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}: YearModelQueueMessage): Promise<void> => {
  await YearModelRepository.createYearModel({
    id: yearModelId,
    year: yearModelYear,
    fuelType: yearModelFuelType,
    modelId,
  });

  const yearModelDetails = await FipeApi.getYearModel({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelYear,
    yearModelFuelType,
  });

  const yearModelNormalized = normalizeYearModel(yearModelDetails);

  await YearModelRepository.updateYearModelCurrentPrice({
    modelId,
    yearModelId,
    currentPrice: yearModelNormalized.value,
    year: yearModelNormalized.reference.year,
    month: yearModelNormalized.reference.month,
  });
};

export default startUpdateYearModel;
