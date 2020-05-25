import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { createBrand } from "../../../src/repository/brands";
import { createModel } from "../../../src/repository/models";
import {
  createYearModel,
  getYearModels,
  updateYearModelCurrentPrice,
} from "../../../src/repository/yearModels";
import {
  generateBrandFixture,
  generateModelFixture,
  generateYearModelFixture,
} from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

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

        const [brand1, brand2] = generateBrandFixture(2);
        const [model1, model2] = generateModelFixture(2);

        const [yearModel1, yearModel2, yearModel3] = generateYearModelFixture(
          4,
        );

        await createBrand({
          id: brand1.id,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
        await createBrand({
          id: brand2.id,
          name: brand2.name,
          vehicleType: VehicleType.car,
          popular: false,
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

        const [brand] = generateBrandFixture(2);
        const [model] = generateModelFixture(2);
        const [yearModel] = generateYearModelFixture(4);

        await createBrand({
          id: brand.id,
          name: brand.name,
          vehicleType: VehicleType.car,
          popular: false,
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