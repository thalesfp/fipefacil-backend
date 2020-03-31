const { getModels } = require("../api/fipeApi");
const { sendMessage } = require("../queue/modelsQueue");
const { createBrand } = require("../repository/brands");
const { normalizeModels } = require("../transformers/valuesFromRemoteApi");

const startUpdateBrand = async ({
  referenceId,
  vehicleType,
  brandId,
  brandName,
}) => {
  await createBrand(brandId, brandName, vehicleType);

  const models = await getModels({ referenceId, vehicleType, brandId });
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
