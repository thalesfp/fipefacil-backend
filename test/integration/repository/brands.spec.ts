import * as MockDate from "mockdate";
import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import {
  createBrand,
  getBrands,
  getBrand,
} from "../../../src/repository/brands";
import { generateBrandFixture } from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

describe("repository", () => {
  beforeAll(() => {
    MockDate.set("2020-01-01");
  });

  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("brands", () => {
    describe("#getBrand", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await getBrand(VehicleType.car, 1)).toBeNull();
      });

      it("should return all brands from vehicle type", async () => {
        expect.assertions(1);

        const [brand1] = generateBrandFixture(4);

        await createBrand({
          id: brand1.id,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
        });

        const brand = await getBrand(VehicleType.car, brand1.id);

        expect(brand).toEqual({
          pk: `BRAND#${brand1.id}`,
          sk: VehicleType.car,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
          createdAt: "2020-01-01T00:00:00.000Z",
        });
      });
    });

    describe("#getBrands", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await getBrands(VehicleType.car)).toEqual([]);
      });

      it("should return all brands from vehicle type", async () => {
        expect.assertions(4);

        const [brand1, brand2, brand3, brand4] = generateBrandFixture(4);

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
        await createBrand({
          id: brand3.id,
          name: brand3.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
        await createBrand({
          id: brand4.id,
          name: brand4.name,
          vehicleType: VehicleType.motorcycle,
          popular: false,
        });

        const response = await getBrands(VehicleType.car);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          pk: `BRAND#${brand1.id}`,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
        });

        expect(response).toContainEqual({
          pk: `BRAND#${brand2.id}`,
          name: brand2.name,
          vehicleType: VehicleType.car,
          popular: false,
        });

        expect(response).toContainEqual({
          pk: `BRAND#${brand3.id}`,
          name: brand3.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
      });
    });
  });
});
