const brandsFixtures = require("./brandFixtures");
const modelsFixtures = require("./modelFixtures");
const yearModelFixtures = require("./yearModelFixtures");

const {
  normalizeBrands,
  normalizeModels,
  normalizeYearModels,
} = require("../../../src/transformers/valuesFromRemoteApi");

const generate = (arrayOfFixtures, count) => {
  const response = [];

  do {
    const newFixture =
      arrayOfFixtures[Math.floor(Math.random() * arrayOfFixtures.length)];

    if (!newFixture.id) throw new Error("Invalid fixture");

    if (!response.map((item) => item.id).includes(newFixture.id)) {
      response.push(newFixture);
    }
  } while (response.length < count);

  return response;
};

const generateFixture = (objectType, count = 1) => {
  switch (objectType) {
    case "brand":
      return generate(normalizeBrands(brandsFixtures), count);
    case "model":
      return generate(normalizeModels(modelsFixtures), count);
    case "yearModel":
      return generate(normalizeYearModels(yearModelFixtures), count);
    default:
      throw new Error(`Invalid object type: ${objectType}`);
  }
};

module.exports = { generateFixture };
