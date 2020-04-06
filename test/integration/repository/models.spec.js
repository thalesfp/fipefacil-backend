const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");

const { createBrand } = require("../../../src/repository/brands");
const { createModel, getModels } = require("../../../src/repository/models");
const { vehicleType } = require("../../../src/constants/vehicleType");

const { generateFixture } = require("../fixtures/generateFixture");

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("models", () => {
    describe("#getModels", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await getModels(1)).toEqual([]);
      });

      it("should return all models from brand", async () => {
        expect.assertions(4);

        const [brand1, brand2] = generateFixture("brand", 2);

        const [model1, model2, model3, model4] = generateFixture("model", 4);

        await createBrand(brand1.id, brand1.name, vehicleType.car);
        await createBrand(brand2.id, brand2.name, vehicleType.car);

        await createModel(model1.id, model1.name, brand1.id);
        await createModel(model2.id, model2.name, brand1.id);
        await createModel(model3.id, model3.name, brand1.id);

        await createModel(model4.id, model4.name, brand2.id);

        const response = await getModels(brand1.id);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          name: model1.name,
          sk: `MODEL#${model1.id}`,
        });

        expect(response).toContainEqual({
          name: model2.name,
          sk: `MODEL#${model2.id}`,
        });

        expect(response).toContainEqual({
          name: model3.name,
          sk: `MODEL#${model3.id}`,
        });
      });
    });
  });
});
