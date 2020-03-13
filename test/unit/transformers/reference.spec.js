const {
  extractDateFromRemoteReference,
} = require("../../../src/transformers/reference");

describe("transformers", () => {
  describe("reference", () => {
    it("should return month number and year from remote FIPE format", () => {
      const fipeFormatSamples = [
        "dezembro/2019 ",
        "novembro/2019 ",
        "outubro/2019 ",
        "setembro/2019 ",
        "agosto/2019 ",
        "julho/2019 ",
        "junho/2019 ",
        "maio/2019 ",
        "abril/2019 ",
        "março/2019 ",
        "fevereiro/2019 ",
        "janeiro/2019 ",
      ];

      const expectedResult = [
        { month: 12, year: 2019 },
        { month: 11, year: 2019 },
        { month: 10, year: 2019 },
        { month: 9, year: 2019 },
        { month: 8, year: 2019 },
        { month: 7, year: 2019 },
        { month: 6, year: 2019 },
        { month: 5, year: 2019 },
        { month: 4, year: 2019 },
        { month: 3, year: 2019 },
        { month: 2, year: 2019 },
        { month: 1, year: 2019 },
      ];

      const results = fipeFormatSamples.map(sample =>
        extractDateFromRemoteReference(sample),
      );

      expect(results).toEqual(expectedResult);
    });
  });
});
