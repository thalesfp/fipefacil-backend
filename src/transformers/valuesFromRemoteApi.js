const months = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

const extractDateFromRemoteReference = date => {
  const [month, year] = date.trim().split("/");

  return { month: months[month], year: parseInt(year, 10) };
};

const normalizeReferences = references =>
  references.map(reference => ({
    id: reference.Codigo,
    ...extractDateFromRemoteReference(reference.Mes),
  }));

const normalizeBrands = brands =>
  brands.map(brand => ({ id: brand.Value, name: brand.Label }));

const normalizeModels = models =>
  models.map(model => ({ id: model.Value, name: model.Label }));

module.exports = {
  normalizeReferences,
  normalizeBrands,
  normalizeModels,
};
