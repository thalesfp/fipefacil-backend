const { getYearModel } = require("../../api/fipeApi");
const {
  createYearModel,
  updateYearModelCurrentPrice,
} = require("../../repository/yearModels");
const {
  normalizeYearModel,
} = require("../../transformers/valuesFromRemoteApi");

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
  await createYearModel({
    id: yearModelId,
    year: yearModelYear,
    fuelType: yearModelFuelType,
    modelId,
  });

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

  await updateYearModelCurrentPrice({
    modelId,
    yearModelId,
    currentPrice: yearModelNormalized.value,
    year: yearModelNormalized.reference.year,
    month: yearModelNormalized.reference.month,
  });
};

module.exports = { startUpdateYearModel };
