import { getYearModels } from "../api/fipeApi";
import { createModel } from "../repository/models";
import sendMessage from "../queue/yearModelsQueue";
import { normalizeYearModels } from "../transformers/valuesFromRemoteApi";
import { VehicleType } from "../types/VehicleType";

const startUpdateModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  modelName,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  modelName: string;
}): Promise<void> => {
  await createModel({ id: modelId, name: modelName, brandId });

  const yearModels = await getYearModels({
    referenceId,
    vehicleType,
    brandId,
    modelId,
  });
  const normalizedYearModels = normalizeYearModels(yearModels);

  await Promise.all(
    normalizedYearModels.map(async (yearModel) =>
      sendMessage({
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
