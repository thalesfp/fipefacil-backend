import * as MockDate from "mockdate";

import startUpdateYearModel from "../../../src/components/startUpdateYearModel";
import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { getYearModels } from "../../../src/repository/yearModels";
import VehicleType from "../../../src/types/VehicleType";
import FuelType from "../../../src/types/FuelType";

jest.mock("../../../src/services/fipeApi", () => ({
  getYearModel: jest
    .fn()
    .mockResolvedValueOnce({
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
    })
    .mockReturnValueOnce({
      Valor: "R$ 15.728,00",
      Marca: "Audi",
      Modelo: "100 2.8 V6 Avant",
      AnoModelo: 1995,
      Combustivel: "Gasolina",
      CodigoFipe: "008076-4",
      MesReferencia: "setembro de 2017 ",
      Autenticacao: "jngjhdzs8tc",
      TipoVeiculo: 1,
      SiglaCombustivel: "G",
      DataConsulta: "domingo, 15 de março de 2020 17:14",
    }),
}));

describe("startUpdateYearModel", () => {
  describe("when updating a new year model", () => {
    const yearModel = {
      referenceId: 252,
      vehicleType: VehicleType.motorcycle,
      brandId: 61,
      modelId: 43,
      yearModelId: "1995-1",
      yearModelYear: 1995,
      yearModelFuelType: FuelType.gasolina,
    };

    beforeAll(async () => {
      MockDate.set("2020-01-01");
      await createPricesTable();
      await startUpdateYearModel(yearModel);
      await startUpdateYearModel(yearModel);
    });

    afterAll(async () => {
      await dropPricesTable();
      MockDate.reset();
    });

    it("should save the year model first time and update only currentPrice and add price in priceHistory in the seconds time", async () => {
      expect.assertions(1);

      const models = await getYearModels(yearModel.modelId);

      const expectedResponse = [
        {
          sk: "YEAR_MODEL#1995-1",
          fuelType: FuelType.gasolina,
          year: 1995,
          currentPrice: 15728,
          priceHistory: {
            "2017-8": 16728,
            "2017-9": 15728,
          },
        },
      ];

      expect(models).toEqual(expectedResponse);
    });
  });
});
