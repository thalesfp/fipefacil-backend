import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { createBrand } from "../../../src/repository/brand";
import { createModel, getModels } from "../../../src/repository/model";
import {
  generateBrandFixture,
  generateModelFixture,
} from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

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

        const [brand1, brand2] = generateBrandFixture(2);

        const [model1, model2, model3, model4] = generateModelFixture(4);

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
        await createModel({
          id: model3.id,
          name: model3.name,
          brandId: brand1.id,
        });

        await createModel({
          id: model4.id,
          name: model4.name,
          brandId: brand2.id,
        });

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
