const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");

const { createBrand } = require("../../../src/repository/brands");
const { createModel } = require("../../../src/repository/models");
const {
  createYearModel,
  getYearModels,
} = require("../../../src/repository/yearModels");
const { vehicleType } = require("../../../src/constants/vehicleType");

const { generateFixture } = require("../fixtures/generateFixture");

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("models", () => {
    describe("#getYearModels", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await getYearModels(1)).toEqual([]);
      });

      it("should return all year models from model", async () => {
        expect.assertions(4);

        const [brand1, brand2] = generateFixture("brand", 2);

        const [model1, model2] = generateFixture("model", 2);

        const [yearModel1, yearModel2, yearModel3] = generateFixture(
          "yearModel",
          4,
        );

        await createBrand(brand1.id, brand1.name, vehicleType.car);
        await createBrand(brand2.id, brand2.name, vehicleType.car);

        await createModel(model1.id, model1.name, brand1.id);
        await createModel(model2.id, model2.name, brand1.id);

        await createYearModel(
          yearModel1.id,
          yearModel1.year,
          yearModel1.fuelType,
          model1.id,
        );

        await createYearModel(
          yearModel2.id,
          yearModel2.year,
          yearModel2.fuelType,
          model1.id,
        );

        await createYearModel(
          yearModel3.id,
          yearModel3.year,
          yearModel3.fuelType,
          model1.id,
        );

        const response = await getYearModels(model1.id);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          sk: `YEAR_MODEL#${yearModel1.id}`,
          year: yearModel1.year,
          fuelType: yearModel1.fuelType,
        });

        expect(response).toContainEqual({
          sk: `YEAR_MODEL#${yearModel2.id}`,
          year: yearModel2.year,
          fuelType: yearModel2.fuelType,
        });

        expect(response).toContainEqual({
          sk: `YEAR_MODEL#${yearModel3.id}`,
          year: yearModel3.year,
          fuelType: yearModel3.fuelType,
        });
      });
    });
  });
});
