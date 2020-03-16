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

      await createReference(1, 10, 2020);
      await createReference(3, 30, 2020);
      await createReference(2, 12, 2020);

      expect(await getCurrentReferenceId()).toEqual(3);
    });
  });
});
