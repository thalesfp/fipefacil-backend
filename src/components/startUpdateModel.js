const Promise = require("bluebird");

const api = require("../fipeApi");
const { createModel } = require("../repository/models");
const { createYearModel } = require("../repository/yearModels");
const { createPrice } = require("../repository/prices");
const {
  normalizeYearModels,
  normalizeYearModel,
} = require("../transformers/valuesFromRemoteApi");

const LIMIT_CONCURRENT_YEAR_MODELS = 10;

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

  await Promise.map(
    normalizedYearModels,
    async yearModel => {
      await createYearModel(
        yearModel.id,
        yearModel.year,
        yearModel.fuelType,
        modelId,
      );

      const yearModelDetails = await api.getYearModel({
        referenceId,
        vehicleType,
        brandId,
        modelId,
        yearModelId: yearModel.id,
      });

      const yearModelNormalized = normalizeYearModel(yearModelDetails);

      await createPrice(
        modelId,
        yearModel.id,
        referenceId,
        yearModelNormalized.value,
      );
    },
    { concurrency: LIMIT_CONCURRENT_YEAR_MODELS },
  );
};

module.exports = { startUpdateModel };
