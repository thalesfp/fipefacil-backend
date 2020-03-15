const api = require("../fipeApi");
const { vehicleType } = require("../constants/vehicleType");
const { sendMessage } = require("../queue/brandsQueue");
const { normalizeBrandsFromRemoteApi } = require("../transformers/brands");

const startUpdate = async reference => {
  return Promise.all(
    [vehicleType.car, vehicleType.motorcycle].map(async type => {
      const brands = await api.getBrands({
        referenceId: reference.id,
        vehicleType: type,
      });

      const normalizedBrands = normalizeBrandsFromRemoteApi(brands);

      await Promise.all(
        normalizedBrands.map(async brand =>
          sendMessage(reference.id, type, brand.id, brand.name),
        ),
      );
    }),
  );
};

module.exports = { startUpdate };
