const {
  normalizeReferences,
  normalizePrice,
  normalizeDateReferenceFromPrice,
} = require("../../../src/transformers/valuesFromRemoteApi");

describe("valuesFromRemoteApi", () => {
  describe("normalizeReferences", () => {
    it("should return id, month number and year from remote FIPE format", () => {
      expect.assertions(1);

      const fipeFormatSamples = [
        {
          Codigo: 252,
          Mes: "março/2020 ",
        },
        {
          Codigo: 251,
          Mes: "fevereiro/2020 ",
        },
        {
          Codigo: 250,
          Mes: "janeiro/2020 ",
        },
        {
          Codigo: 249,
          Mes: "dezembro/2019 ",
        },
        {
          Codigo: 248,
          Mes: "novembro/2019 ",
        },
        {
          Codigo: 247,
          Mes: "outubro/2019 ",
        },
      ];

      const expectedResult = [
        { id: 252, month: 3, year: 2020 },
        { id: 251, month: 2, year: 2020 },
        { id: 250, month: 1, year: 2020 },
        { id: 249, month: 12, year: 2019 },
        { id: 248, month: 11, year: 2019 },
        { id: 247, month: 10, year: 2019 },
      ];

      const results = normalizeReferences(fipeFormatSamples);

      expect(results).toEqual(expectedResult);
    });
  });

  describe("normalizeDateReferenceFromPrice", () => {
    it("should return month number and year", () => {
      expect.assertions(1);

      const results = normalizeDateReferenceFromPrice("abril de 2020 ");

      expect(results).toEqual({ month: 4, year: 2020 });
    });
  });

  describe("normalizePrice", () => {
    it("should convert string price to number", () => {
      expect.assertions(1);

      expect(normalizePrice("R$ 16.728,00")).toEqual(16728);
    });

    it("should convert string price with cents to number", () => {
      expect.assertions(1);

      expect(normalizePrice("R$ 10.394.831,10")).toEqual(10394831.1);
    });
  });
});
