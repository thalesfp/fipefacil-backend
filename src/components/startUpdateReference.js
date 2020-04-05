const { getBrands } = require("../api/fipeApi");
const { vehicleType } = require("../constants/vehicleType");
const { sendMessage } = require("../queue/brandsQueue");
const { normalizeBrands } = require("../transformers/valuesFromRemoteApi");

const startUpdateReference = async ({ reference, apiTimeout }) => {
  return Promise.all(
    [vehicleType.car, vehicleType.motorcycle].map(async (type) => {
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
    }),
  );
};

module.exports = { startUpdateReference };
