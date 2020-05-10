const { getBrands } = require("../../repository/brands");

const normalizeBrands = async () => {
  const brands = await getBrands();
};

module.exports = { normalizeBrands };
