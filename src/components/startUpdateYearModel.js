const api = require("../fipeApi");
const { createYearModel } = require("../repository/yearModels");
const { createPrice } = require("../repository/prices");
const { normalizeYearModel } = require("../transformers/valuesFromRemoteApi");

const startUpdateYearModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}) => {
  await createYearModel(yearModelId, yearModelYear, yearModelFuelType, modelId);

  const yearModelDetails = await api.getYearModel({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelId,
  });

  const yearModelNormalized = normalizeYearModel(yearModelDetails);

  await createPrice(
    modelId,
    yearModelId,
    referenceId,
    yearModelNormalized.value,
  );
};

module.exports = { startUpdateYearModel };
