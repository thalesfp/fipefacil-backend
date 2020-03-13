const normalizeBrandsFromRemoteApi = brands =>
  brands.map(brand => ({ id: brand.Value, name: brand.Label }));

module.exports = { normalizeBrandsFromRemoteApi };
