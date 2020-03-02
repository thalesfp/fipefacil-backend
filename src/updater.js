const { getBrands, getModels } = require("./fipeApi");

const vehicleTypes = {
  motorcycle: "motos",
  car: "carros",
};

const startUpdate = async referenceId => {
  const carBrands = await getBrands({
    referenceId,
    vehicleType: vehicleTypes.car,
  });

  for (const carBrand of carBrands) {
    const models = await getModels({
      referenceId,
      vehicleType: vehicleTypes.car,
      brandId: carBrand.Value,
    });
    console.log(models);
  }

  // carBrands.map(carBrand => getModels);
};

const updateBrand = async ({ referenceId, vehicleType, brandId }) => {
  const models = await getModels({ referenceId, vehicleType, brandId });

  models.map(model => console.log(model));

  return true;
};

const exportedFunctions = {
  startUpdate,
  updateBrand,
};

(async () => {
  await startUpdate(251);
})();

module.exports = exportedFunctions;
