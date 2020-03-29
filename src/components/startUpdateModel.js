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

  // await Promise.map(
  //   normalizedYearModels,
  //   async (yearModel) => {
  //     await createYearModel(
  //       yearModel.id,
  //       yearModel.year,
  //       yearModel.fuelType,
  //       modelId,
  //     );

  //     const yearModelDetails = await api.getYearModel({
  //       referenceId,
  //       vehicleType,
  //       brandId,
  //       modelId,
  //       yearModelId: yearModel.id,
  //     });

  //     const yearModelNormalized = normalizeYearModel(yearModelDetails);

  //     await createPrice(
  //       modelId,
  //       yearModel.id,
  //       referenceId,
  //       yearModelNormalized.value,
  //     );
  //   },
  //   { concurrency: LIMIT_CONCURRENT_YEAR_MODELS },
  // );
};

module.exports = { startUpdateModel };
