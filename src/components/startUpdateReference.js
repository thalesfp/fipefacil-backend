const { getBrands } = require("../api/fipeApi");
const { vehicleType } = require("../constants/vehicleType");
const { sendMessage } = require("../queue/brandsQueue");
const { createReference } = require("../repository/references");
const { normalizeBrands } = require("../transformers/valuesFromRemoteApi");

const startUpdateReference = async ({ reference, apiTimeout }) => {
  await createReference(reference);

  return Promise.all(
    [vehicleType.car, vehicleType.motorcycle, vehicleType.trucks].map(
      async (type) => {
        const brands = await getBrands({
          params: {
            referenceId: reference.id,
            vehicleType: type,
          },
          timeout: apiTimeout,
        });

        const normalizedBrands = normalizeBrands(brands);

        await Promise.all(
          normalizedBrands.map(async (brand) =>
            sendMessage({
              referenceId: reference.id,
              vehicleType: type,
              brandId: brand.id,
              brandName: brand.name,
            }),
          ),
        );
      },
    ),
  );
};

module.exports = { startUpdateReference };
