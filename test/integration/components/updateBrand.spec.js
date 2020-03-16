const MockDate = require("mockdate");

const { updateBrand } = require("../../../src/components/updateBrand");
const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");
const { getBrand } = require("../../../src/repository/brands");
const { getModels } = require("../../../src/repository/models");
const { getYearModels } = require("../../../src/repository/yearModels");
const { getPrices } = require("../../../src/repository/prices");

jest.mock("../../../src/fipeApi.js", () => ({
  getModels: () =>
    Promise.resolve([
      {
        Label: "100 2.8 V6",
        Value: 43,
      },
      {
        Label: "100 2.8 V6 Avant",
        Value: 44,
      },
    ]),
  getYearModels: ({ modelId }) => {
    switch (modelId) {
      case 43:
        return Promise.resolve([
          {
            Label: "1995 Gasolina",
            Value: "1995-1",
          },
          {
            Label: "1994 Gasolina",
            Value: "1994-1",
          },
        ]);

      case 44:
        return Promise.resolve([
          {
            Label: "1994 Diesel",
            Value: "1994-3",
          },
        ]);
      default:
        return Promise.reject();
    }
  },
  getYearModel: ({ modelId, yearModelId }) => {
    if (modelId === 43 && yearModelId === "1995-1") {
      return Promise.resolve({
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
      });
    }

    if (modelId === 43 && yearModelId === "1994-1") {
      return Promise.resolve({
        Valor: "R$ 11.728,00",
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
      });
    }

    if (modelId === 44 && yearModelId === "1994-3") {
      return Promise.resolve({
        Valor: "R$ 9.000,00",
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
      });
    }
  },
}));

describe("updateBrand", () => {
  describe("when updating a brand", () => {
    const brand = {
      referenceId: 252,
      vehicleType: "motos",
      brandId: "61",
      brandName: "AGRALE",
    };

    beforeAll(async () => {
      MockDate.set("2020-01-01");
      await createPricesTable();
      await updateBrand(brand);
    });

    afterAll(async () => {
      await dropPricesTable();
      MockDate.reset();
    });

    it("should save the brand", async () => {
      expect.assertions(1);

      const persistedBrand = await getBrand(brand.vehicleType, brand.brandId);

      expect(persistedBrand).toEqual([
        {
          pk: "motos",
          sk: "BRAND#61",
          name: "AGRALE",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ]);
    });

    it("should save the models", async () => {
      expect.assertions(1);

      const models = await getModels(brand.brandId);

      const expectedResponse = [
        {
          pk: "BRAND#61",
          sk: "MODEL#43",
          name: "100 2.8 V6",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
        {
          pk: "BRAND#61",
          sk: "MODEL#44",
          name: "100 2.8 V6 Avant",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(models).toEqual(expectedResponse);
    });

    it("should save the year models of model 43", async () => {
      expect.assertions(1);

      const yearModels = await getYearModels(43);

      const expectedResponse = [
        {
          pk: "MODEL#43",
          sk: "YEAR_MODEL#1994-1",
          fuelType: "1",
          year: "1994",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
        {
          pk: "MODEL#43",
          sk: "YEAR_MODEL#1995-1",
          fuelType: "1",
          year: "1995",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(yearModels).toEqual(expectedResponse);
    });

    it("should save the year models of model 44", async () => {
      expect.assertions(1);

      const yearModels = await getYearModels(44);

      const expectedResponse = [
        {
          pk: "MODEL#44",
          sk: "YEAR_MODEL#1994-3",
          fuelType: "3",
          year: "1994",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(yearModels).toEqual(expectedResponse);
    });

    it("should save price of year model 43 / 1995-1", async () => {
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

    it("should save price of year model 43 / 1994-1", async () => {
      expect.assertions(1);

      const price = await getPrices(43, "1994-1");

      const expectedResponse = [
        {
          pk: "MODEL#43_YEAR_MODEL#1994-1",
          sk: "REF#252",
          value: "R$ 11.728,00",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(price).toEqual(expectedResponse);
    });

    it("should save price of year model 44 / 1994-3", async () => {
      expect.assertions(1);

      const price = await getPrices(44, "1994-3");

      const expectedResponse = [
        {
          pk: "MODEL#44_YEAR_MODEL#1994-3",
          sk: "REF#252",
          value: "R$ 9.000,00",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ];

      expect(price).toEqual(expectedResponse);
    });
  });
});
