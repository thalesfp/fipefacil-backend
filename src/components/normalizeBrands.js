const { getBrands } = require("../repository/brands");
const {
  isPopularBrand,
  normalizeBrandName,
} = require("../transformers/brandsFromRemoteApi");
const { createBrand } = require("../repository/brands");
const { vehicleType } = require("../constants/vehicleType");

const normalizeBrands = async () => {
  const brands = await getBrands(vehicleType.car);

  const normalizedBrands = brands.map((brand) => ({
    ...brand,
    vehicleType: vehicleType.car,
    name: normalizeBrandName(brand.name),
    popular: isPopularBrand(brand.name),
  }));

  return Promise.all(normalizedBrands.map((brand) => createBrand(brand)));
};

module.exports = { normalizeBrands };
