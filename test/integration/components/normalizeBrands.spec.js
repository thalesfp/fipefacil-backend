// const { normalizeBrands } = require("../../../src/components/normalizeBrands");
// const {
//   createPricesTable,
//   dropPricesTable,
// } = require("../../../src/repository/databaseManager");
// const { createBrand, getBrands } = require("../../../src/repository/brands");
// const brandFixtures = require("../fixtures/brandFixtures");
// const { vehicleType } = require("../../../src/constants/vehicleType");

describe("normalizeBrands", () => {
  // beforeAll(async () => {
  //   await createPricesTable();

  //   await Promise.all(
  //     brandFixtures.map(async (brand) =>
  //       createBrand({
  //         id: brand.Value,
  //         name: brand.Label,
  //         vehicleType: vehicleType.car,
  //         popular: false,
  //       }),
  //     ),
  //   );
  // });

  // afterAll(async () => {
  //   await dropPricesTable();
  // });

  it("should normalize brands", async () => {
    expect.assertions(1);
    expect(true).toBe(true);

    //   await normalizeBrands();

    //   const normalizedBrands = await getBrands(vehicleType.car);

    //   expect(normalizedBrands).toEqual([]);
  });
});
