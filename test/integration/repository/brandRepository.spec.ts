import * as MockDate from "mockdate";

import * as manager from "../../../src/repository/databaseManager";
import * as repository from "../../../src/repository/brandRepository";
import { generateBrandFixture } from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

describe("repository", () => {
  beforeEach(async () => {
    MockDate.set("2020-01-01");
    await manager.createPricesTable();
  });

  afterEach(async () => {
    await manager.dropPricesTable();
    MockDate.reset();
  });

  describe("brands", () => {
    describe("createBrand", () => {
      it("should create a new brand", async () => {
        expect.assertions(1);

        const [brand] = generateBrandFixture(4);

        await repository.createBrand({
          id: brand.id,
          name: brand.name,
          popular: false,
          vehicleType: VehicleType.car,
        });

        const response = await repository.getBrands(VehicleType.car);

        expect(response).toContainEqual({
          pk: VehicleType.car,
          sk: `BRAND#${brand.id}`,
          name: brand.name,
          vehicleType: VehicleType.car,
          popular: false,
          createdAt: "2020-01-01T00:00:00.000Z",
        });
      });

      it("should not replace an existing brand", async () => {
        expect.assertions(1);

        const [brand] = generateBrandFixture(4);

        await repository.createBrand({
          id: brand.id,
          name: "brand-original",
          popular: false,
          vehicleType: VehicleType.car,
        });

        const currentBrand = await repository.getBrand(
          VehicleType.car,
          brand.id,
        );

        await repository.createBrand({
          id: brand.id,
          name: "brand-updated",
          popular: false,
          vehicleType: VehicleType.car,
        });

        const response = await repository.getBrands(VehicleType.car);

        expect(response[0]).toEqual(currentBrand);
      });
    });

    describe("getBrands", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await repository.getBrands(VehicleType.car)).toEqual([]);
      });

      it("should return all brands from vehicle type", async () => {
        expect.assertions(4);

        const [brand1, brand2, brand3, brand4] = generateBrandFixture(4);

        await repository.createBrand({
          id: brand1.id,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
        await repository.createBrand({
          id: brand2.id,
          name: brand2.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
        await repository.createBrand({
          id: brand3.id,
          name: brand3.name,
          vehicleType: VehicleType.car,
          popular: false,
        });
        await repository.createBrand({
          id: brand4.id,
          name: brand4.name,
          vehicleType: VehicleType.motorcycle,
          popular: false,
        });

        const response = await repository.getBrands(VehicleType.car);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          pk: VehicleType.car,
          sk: `BRAND#${brand1.id}`,
          name: brand1.name,
          vehicleType: VehicleType.car,
          popular: false,
          createdAt: "2020-01-01T00:00:00.000Z",
        });

        expect(response).toContainEqual({
          pk: VehicleType.car,
          sk: `BRAND#${brand2.id}`,
          name: brand2.name,
          vehicleType: VehicleType.car,
          popular: false,
          createdAt: "2020-01-01T00:00:00.000Z",
        });

        expect(response).toContainEqual({
          pk: VehicleType.car,
          sk: `BRAND#${brand3.id}`,
          name: brand3.name,
          vehicleType: VehicleType.car,
          popular: false,
          createdAt: "2020-01-01T00:00:00.000Z",
        });
      });
    });

    describe("updateBrand", () => {
      describe("when brand does not exist", () => {
        it("should throw an error", async () => {
          expect.assertions(1);

          await expect(
            repository.updateBrand(VehicleType.car, 1, {
              name: "NewName",
              popular: true,
            }),
          ).rejects.toThrow("Item not found");
        });
      });

      describe("when brand exists", () => {
        it("should update brand parameters", async () => {
          expect.assertions(1);

          const [brand1] = generateBrandFixture(1);

          await repository.createBrand({
            id: brand1.id,
            name: brand1.name,
            vehicleType: VehicleType.car,
            popular: false,
          });

          // should keep the createdAt parameter to 2020-01-01
          MockDate.set("2020-01-02");

          const response = await repository.updateBrand(
            VehicleType.car,
            brand1.id,
            {
              name: "NewName",
              popular: true,
            },
          );

          expect(response).toEqual({
            pk: VehicleType.car,
            sk: `BRAND#${brand1.id}`,
            name: "NewName",
            vehicleType: VehicleType.car,
            popular: true,
            createdAt: "2020-01-01T00:00:00.000Z",
          });
        });
      });
    });
  });
});
