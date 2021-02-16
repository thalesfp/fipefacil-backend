import * as FipeApi from "../services/fipeApi";
import * as ModelRepository from "../repository/model";
import * as YearModelQueue from "../queue/yearModelQueue";
import { normalizeYearModels } from "../transformers/valuesFromRemoteApi";
import { ModelQueueMessage } from "../queue/modelQueue";

const startUpdateModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  modelName,
}: ModelQueueMessage): Promise<void> => {
  await ModelRepository.createModel({ id: modelId, name: modelName, brandId });

  const yearModels = await FipeApi.getYearModels({
    referenceId,
    vehicleType,
    brandId,
    modelId,
  });
  const normalizedYearModels = normalizeYearModels(yearModels);

  await Promise.all(
    normalizedYearModels.map(async (yearModel) =>
      YearModelQueue.sendMessage({
        referenceId,
        vehicleType,
        brandId,
        modelId,
        yearModelId: yearModel.id,
        yearModelYear: yearModel.year,
        yearModelFuelType: yearModel.fuelType,
      }),
    ),
  );
};

export default startUpdateModel;
