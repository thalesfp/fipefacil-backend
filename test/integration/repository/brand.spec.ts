import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import {
  createBrand,
  getBrands,
} from "../../../src/repository/brandRepository";
import { generateBrandFixture } from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("brands", () => {
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
          sk: `BRAND#${brand1.id}`,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
        });

        expect(response).toContainEqual({
          sk: `BRAND#${brand2.id}`,
          name: brand2.name,
          vehicleType: VehicleType.car,
          popular: false,
        });

        expect(response).toContainEqual({
          sk: `BRAND#${brand3.id}`,
          name: brand3.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
      });
    });
  });
});
