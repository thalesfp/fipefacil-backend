const { getBrands } = require("../repository/brands");
const {
  isPopularBrand,
  normalizeBrandName,
} = require("../transformers/brandsFromRemoteApi");
const { createBrand } = require("../repository/brands");
const { vehicleType } = require("../constants/vehicleType");

const normalizeBrands = async (): void => {
  const brands = await getBrands(vehicleType.car);
  const normalizedBrands = brands.map((brand) => ({
    ...brand,
    vehicleType: vehicleType.car,
    name: normalizeBrandName(brand.name),
    popular: isPopularBrand(brand.name),
  }));

  await Promise.all(normalizedBrands.map(async (brand) => createBrand(brand)));

  return Promise.resolve();
};

module.exports = { normalizeBrands };
