const { getYearModels } = require("../api/fipeApi");
const { createModel } = require("../repository/models");
const { sendMessage } = require("../queue/yearModelsQueue");
const { normalizeYearModels } = require("../transformers/valuesFromRemoteApi");

const startUpdateModel = async ({
  model: { referenceId, vehicleType, brandId, modelId, modelName },
  apiTimeout,
}) => {
  await createModel(modelId, modelName, brandId);

  const yearModels = await getYearModels({
    params: {
      referenceId,
      vehicleType,
      brandId,
      modelId,
    },
    timeout: apiTimeout,
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
