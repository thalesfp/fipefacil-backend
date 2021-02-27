import * as MockDate from "mockdate";
import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";

import {
  createReference,
  getCurrentReference,
  getAllReferences,
} from "../../../src/repository/referenceRepository";

describe("repository", () => {
  beforeEach(async () => {
    MockDate.set("2020-01-01");
    await createPricesTable();
  });

  afterEach(async () => {
    await dropPricesTable();
    MockDate.reset();
  });

  describe("references", () => {
    describe("getCurrentReference", () => {
      it("should return null when there is no reference", async () => {
        expect.assertions(1);

        expect(await getCurrentReference()).toBeNull();
      });

      it("should return greatest reference id", async () => {
        expect.assertions(1);

        await createReference({ id: 1, month: 10, year: 2020 });
        await createReference({ id: 3, month: 30, year: 2020 });
        await createReference({ id: 2, month: 12, year: 2020 });

        const currentReference = await getCurrentReference();

        expect(currentReference?.sk).toEqual("3");
      });
    });

    describe("getAllReferences", () => {
      it("should return empty array when there is no reference", async () => {
        expect.assertions(1);

        expect(await getAllReferences()).toEqual([]);
      });

      it("should return a list of references", async () => {
        expect.assertions(4);

        await createReference({ id: 1, month: 10, year: 2020 });
        await createReference({ id: 2, month: 12, year: 2020 });
        await createReference({ id: 3, month: 30, year: 2020 });

        const references = await getAllReferences();

        expect(references.length).toEqual(3);

        expect(references).toContainEqual({
          pk: "REF",
          sk: "1",
          month: 10,
          year: 2020,
          createdAt: "2020-01-01T00:00:00.000Z",
        });

        expect(references).toContainEqual({
          pk: "REF",
          sk: "2",
          month: 12,
          year: 2020,
          createdAt: "2020-01-01T00:00:00.000Z",
        });

        expect(references).toContainEqual({
          pk: "REF",
          sk: "3",
          month: 30,
          year: 2020,
          createdAt: "2020-01-01T00:00:00.000Z",
        });
      });
    });
  });
});
