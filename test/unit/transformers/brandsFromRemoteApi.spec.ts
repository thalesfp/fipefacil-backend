import { normalizeBrandName } from "../../../src/transformers/brandsFromRemoteApi";

describe("brandsFromRemoteApi", () => {
  describe("normalizeBrandName", () => {
    it("returns new brand name when available", () => {
      expect.assertions(1);
      expect(normalizeBrandName("LIFAN")).toEqual("Lifan");
    });

    it("returns same brand name when not available", () => {
      expect.assertions(1);
      expect(normalizeBrandName("MY BRAND")).toEqual("MY BRAND");
    });
  });
});
