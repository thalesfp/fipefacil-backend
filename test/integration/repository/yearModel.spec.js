const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");

const { createBrand } = require("../../../src/repository/brands");
const { createModel } = require("../../../src/repository/models");
const {
  createYearModel,
  getYearModels,
  updateYearModelCurrentPrice,
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

        await createBrand({
          id: brand1.id,
          name: brand1.name,
          vehicleType: vehicleType.car,
        });
        await createBrand({
          id: brand2.id,
          name: brand2.name,
          vehicleType: vehicleType.car,
        });

        await createModel({
          id: model1.id,
          name: model1.name,
          brandId: brand1.id,
        });
        await createModel({
          id: model2.id,
          name: model2.name,
          brandId: brand1.id,
        });

        await createYearModel({
          id: yearModel1.id,
          year: yearModel1.year,
          fuelType: yearModel1.fuelType,
          modelId: model1.id,
        });

        await createYearModel({
          id: yearModel2.id,
          year: yearModel2.year,
          fuelType: yearModel2.fuelType,
          modelId: model1.id,
        });

        await createYearModel({
          id: yearModel3.id,
          year: yearModel3.year,
          fuelType: yearModel3.fuelType,
          modelId: model1.id,
        });

        const response = await getYearModels(model1.id);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          year: yearModel1.year,
          fuelType: yearModel1.fuelType,
          currentPrice: null,
          priceHistory: {},
        });

        expect(response).toContainEqual({
          year: yearModel2.year,
          fuelType: yearModel2.fuelType,
          currentPrice: null,
          priceHistory: {},
        });

        expect(response).toContainEqual({
          year: yearModel3.year,
          fuelType: yearModel3.fuelType,
          currentPrice: null,
          priceHistory: {},
        });
      });
    });

    describe("#updateYearModelCurrentPrice", () => {
      it("should update currentPrice attribute and priceHistory", async () => {
        expect.assertions(2);

        const [brand] = generateFixture("brand", 2);
        const [model] = generateFixture("model", 2);
        const [yearModel] = generateFixture("yearModel", 4);

        await createBrand({
          id: brand.id,
          name: brand.name,
          vehicleType: vehicleType.car,
        });
        await createModel({
          id: model.id,
          name: model.name,
          brandId: brand.id,
        });
        await createYearModel({
          id: yearModel.id,
          year: yearModel.year,
          fuelType: yearModel.fuelType,
          modelId: model.id,
        });

        await updateYearModelCurrentPrice({
          modelId: model.id,
          yearModelId: yearModel.id,
          currentPrice: 2000,
          year: 2020,
          month: 1,
        });

        const response = await updateYearModelCurrentPrice({
          modelId: model.id,
          yearModelId: yearModel.id,
          currentPrice: 1900,
          year: 2020,
          month: 2,
        });

        expect(response.currentPrice).toEqual(1900);
        expect(response.priceHistory).toEqual({
          "2020-1": 2000,
          "2020-2": 1900,
        });
      });
    });
  });
});
