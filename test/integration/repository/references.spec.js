const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");

const {
  createReference,
  getCurrentReferenceId,
} = require("../../../src/repository/references");

describe("repository", () => {
  beforeEach(async () => createPricesTable());

  afterEach(async () => dropPricesTable());

  describe("references", () => {
    it("should return null when there is no reference", async () => {
      expect.assertions(1);

      expect(await getCurrentReferenceId()).toBeNull();
    });

    it("should return greatest reference id", async () => {
      expect.assertions(1);

      await createReference({ id: 1, month: 10, year: 2020 });
      await createReference({ id: 3, month: 30, year: 2020 });
      await createReference({ id: 2, month: 12, year: 2020 });

      expect(await getCurrentReferenceId()).toEqual(3);
    });
  });
});
