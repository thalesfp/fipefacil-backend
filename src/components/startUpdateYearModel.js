const { getYearModel } = require("../api/fipeApi");
const { createYearModel } = require("../repository/yearModels");
const { createPrice } = require("../repository/prices");
const { normalizeYearModel } = require("../transformers/valuesFromRemoteApi");

const startUpdateYearModel = async ({
  yearModel: {
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelId,
    yearModelYear,
    yearModelFuelType,
  },
  apiTimeout,
}) => {
  await createYearModel(yearModelId, yearModelYear, yearModelFuelType, modelId);

  const yearModelDetails = await getYearModel({
    params: {
      referenceId,
      vehicleType,
      brandId,
      modelId,
      yearModelYear,
      yearModelFuelType,
    },
    timeout: apiTimeout,
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
