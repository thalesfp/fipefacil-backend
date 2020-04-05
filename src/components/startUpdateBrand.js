const { getModels } = require("../api/fipeApi");
const { sendMessage } = require("../queue/modelsQueue");
const { createBrand } = require("../repository/brands");
const { normalizeModels } = require("../transformers/valuesFromRemoteApi");

const startUpdateBrand = async ({
  brand: { referenceId, vehicleType, brandId, brandName },
  apiTimeout,
}) => {
  await createBrand(brandId, brandName, vehicleType);

  const models = await getModels({
    params: { referenceId, vehicleType, brandId },
    timeout: apiTimeout,
  });
  const normalizedModels = normalizeModels(models);

  return Promise.all(
    normalizedModels.map(async (model) =>
      sendMessage({
        referenceId,
        vehicleType,
        brandId,
        modelId: model.id,
        modelName: model.name,
      }),
    ),
  );
};

module.exports = { startUpdateBrand };
