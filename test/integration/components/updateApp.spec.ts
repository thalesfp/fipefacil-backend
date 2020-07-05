import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { updateApp } from "../../../src/components/updateApp";
import { createBrand } from "../../../src/repository/brands";
import { createModel } from "../../../src/repository/models";
import { createYearModel } from "../../../src/repository/yearModels";
import {
  generateBrandFixture,
  generateModelFixture,
  generateYearModelFixture,
} from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("updateApp", () => {
    describe("#updateApp", () => {
      it("should generate array containing all brands of vehicle type", async () => {
        expect.assertions(1);

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

        const response = await updateApp(VehicleType.car);

        expect(response).toEqual(
          expect.arrayContaining([
            {
              sk: `BRAND#${brand1.id}`,
              name: brand1.name,
              popular: false,
              vehicleType: VehicleType.car,
              models: expect.arrayContaining([
                {
                  sk: `MODEL#${model1.id}`,
                  name: model1.name,
                  yearModels: expect.arrayContaining([
                    {
                      sk: `YEAR_MODEL#${yearModel3.id}`,
                      year: yearModel3.year,
                      fuelType: 1,
                      currentPrice: null,
                      priceHistory: {},
                    },
                    {
                      sk: `YEAR_MODEL#${yearModel2.id}`,
                      year: yearModel2.year,
                      fuelType: 1,
                      currentPrice: null,
                      priceHistory: {},
                    },
                    {
                      sk: `YEAR_MODEL#${yearModel1.id}`,
                      year: yearModel1.year,
                      fuelType: 1,
                      currentPrice: null,
                      priceHistory: {},
                    },
                  ]),
                },
                {
                  sk: `MODEL#${model2.id}`,
                  name: model2.name,
                  yearModels: [],
                },
              ]),
            },
            {
              sk: `BRAND#${brand2.id}`,
              name: brand2.name,
              popular: false,
              vehicleType: VehicleType.car,
              models: [],
            },
          ]),
        );
      });
    });
  });
});
