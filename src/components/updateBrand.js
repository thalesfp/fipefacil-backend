const Promise = require("bluebird");

const api = require("../fipeApi");
const { createBrand } = require("../repository/brands");
const { createModel } = require("../repository/models");
const { createYearModel } = require("../repository/yearModels");
const { createPrice } = require("../repository/prices");
const {
  normalizeModels,
  normalizeYearModels,
  normalizeYearModel,
} = require("../transformers/valuesFromRemoteApi");

const updateBrand = async ({
  referenceId,
  vehicleType,
  brandId,
  brandName,
}) => {
  await createBrand(brandId, brandName, vehicleType);

  const models = await api.getModels({ referenceId, vehicleType, brandId });
  const normalizedModels = normalizeModels(models);

  return Promise.map(normalizedModels, async model => {
    await createModel(model.id, model.name, brandId);

    const yearModels = await api.getYearModels({
      referenceId,
      vehicleType,
      brandId,
      modelId: model.id,
    });
    const normalizedYearModels = normalizeYearModels(yearModels);

    await Promise.map(normalizedYearModels, async yearModel => {
      await createYearModel(
        yearModel.id,
        yearModel.year,
        yearModel.fuelType,
        model.id,
      );

      const yearModelDetails = await api.getYearModel({
        referenceId,
        vehicleType,
        brandId,
        modelId: model.id,
        yearModelId: yearModel.id,
      });

      const yearModelNormalized = normalizeYearModel(yearModelDetails);

      await createPrice(
        model.id,
        yearModel.id,
        referenceId,
        yearModelNormalized.value,
      );
    });
  });
};

module.exports = { updateBrand };
