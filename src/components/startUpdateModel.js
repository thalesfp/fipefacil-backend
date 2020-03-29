const api = require("../fipeApi");
const { createModel } = require("../repository/models");
const { sendMessage } = require("../queue/yearModelsQueue");
const { normalizeYearModels } = require("../transformers/valuesFromRemoteApi");

const startUpdateModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  modelName,
}) => {
  await createModel(modelId, modelName, brandId);

  const yearModels = await api.getYearModels({
    referenceId,
    vehicleType,
    brandId,
    modelId,
  });
  const normalizedYearModels = normalizeYearModels(yearModels);

  return Promise.all(
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

module.exports = { startUpdateModel };
