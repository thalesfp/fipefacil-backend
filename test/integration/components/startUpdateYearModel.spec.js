const MockDate = require("mockdate");

const {
  startUpdateYearModel,
} = require("../../../src/components/updater/startUpdateYearModel");
const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");
const { getYearModels } = require("../../../src/repository/yearModels");
const { getPrices } = require("../../../src/repository/prices");
const { vehicleType } = require("../../../src/constants/vehicleType");

jest.mock("../../../src/api/fipeApi.js", () => ({
  getYearModel: () =>
    Promise.resolve({
      Valor: "R$ 16.728,00",
      Marca: "Audi",
      Modelo: "100 2.8 V6 Avant",
      AnoModelo: 1995,
      Combustivel: "Gasolina",
      CodigoFipe: "008076-4",
      MesReferencia: "agosto de 2017 ",
      Autenticacao: "jngjhdzs8tc",
      TipoVeiculo: 1,
      SiglaCombustivel: "G",
      DataConsulta: "domingo, 15 de março de 2020 17:14",
    }),
}));

describe("startUpdateYearModel", () => {
  describe("when updating a year model", () => {
    const yearModel = {
      referenceId: 252,
      vehicleType: vehicleType.motorcycle,
      brandId: "61",
      modelId: 43,
      yearModelId: "1995-1",
      yearModelYear: "1995",
      yearModelFuelType: "1",
    };

    beforeAll(async () => {
      MockDate.set("2020-01-01");
      await createPricesTable();
      await startUpdateYearModel({ yearModel });
    });

    afterAll(async () => {
      await dropPricesTable();
      MockDate.reset();
    });

    it("should save the year model", async () => {
      expect.assertions(1);

      const models = await getYearModels(yearModel.modelId);

      const expectedResponse = [
        {
          sk: "YEAR_MODEL#1995-1",
          fuelType: "1",
          year: "1995",
        },
      ];

      expect(models).toEqual(expectedResponse);
    });

    it("should save the year model price", async () => {
      expect.assertions(1);

      const price = await getPrices(43, "1995-1");

      const expectedResponse = [
        {
          pk: "MODEL#43_YEAR_MODEL#1995-1",
          sk: "REF#252",
          value: "R$ 16.728,00",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(price).toEqual(expectedResponse);
    });
  });
});
