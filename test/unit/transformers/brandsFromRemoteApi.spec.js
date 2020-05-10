const {
  normalizeBrandName,
  isPopularBrand,
} = require("../../../src/transformers/brandsFromRemoteApi");

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

  describe("isPopularBrand", () => {
    it("returns true when brand is popular", () => {
      expect.assertions(1);
      expect(isPopularBrand("GM - Chevrolet")).toBe(true);
    });

    it("returns false when brand is not popular", () => {
      expect.assertions(1);
      expect(isPopularBrand("Lifan")).toBe(false);
    });
  });
});
