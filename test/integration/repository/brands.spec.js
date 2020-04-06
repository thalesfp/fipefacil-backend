const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");

const { createBrand, getBrands } = require("../../../src/repository/brands");
const { vehicleType } = require("../../../src/constants/vehicleType");

const { generateFixture } = require("../fixtures/generateFixture");

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("brands", () => {
    describe("#getBrands", () => {
      it("should return empty array for empty responses", async () => {
        expect.assertions(1);

        expect(await getBrands(vehicleType.car)).toEqual([]);
      });

      it("should return all brands from vehicle type", async () => {
        expect.assertions(4);

        const [brand1, brand2, brand3, brand4] = generateFixture("brand", 4);

        await createBrand(brand1.id, brand1.name, vehicleType.car);
        await createBrand(brand2.id, brand2.name, vehicleType.car);
        await createBrand(brand3.id, brand3.name, vehicleType.car);
        await createBrand(brand4.id, brand4.name, vehicleType.motorcycle);

        const response = await getBrands(vehicleType.car);

        expect(response.length).toEqual(3);

        expect(response).toContainEqual({
          name: brand1.name,
          sk: `BRAND#${brand1.id}`,
        });

        expect(response).toContainEqual({
          name: brand2.name,
          sk: `BRAND#${brand2.id}`,
        });

        expect(response).toContainEqual({
          name: brand3.name,
          sk: `BRAND#${brand3.id}`,
        });
      });
    });
  });
});
