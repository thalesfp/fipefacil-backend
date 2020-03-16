const {
  normalizeReferences,
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
});
