import { getYearModel } from "../services/fipeApi";
import {
  createYearModel,
  updateYearModelCurrentPrice,
} from "../repository/yearModels";
import { normalizeYearModel } from "../transformers/valuesFromRemoteApi";
import { YearModelQueueMessage } from "../queue/yearModelsQueue";

const startUpdateYearModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}: YearModelQueueMessage): Promise<void> => {
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
