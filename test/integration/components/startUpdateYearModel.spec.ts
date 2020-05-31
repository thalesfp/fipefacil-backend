import * as MockDate from "mockdate";

import startUpdateYearModel from "../../../src/components/startUpdateYearModel";
import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { getYearModels } from "../../../src/repository/yearModels";
import VehicleType from "../../../src/types/VehicleType";
import FuelType from "../../../src/types/FuelType";

jest.mock("../../../src/api/fipeApi", () => ({
  getYearModel: (): Promise<AnoModeloResponseType> =>
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
          fuelType: FuelType.gasolina,
          year: 1995,
          currentPrice: 16728,
          priceHistory: {
            "2017-8": 16728,
          },
        },
      ];

      expect(models).toEqual(expectedResponse);
    });
  });
});
