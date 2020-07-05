import {
  getReferences,
  getBrands,
  getModels,
  getYearModels,
  getYearModel,
} from "../../src/services/fipeApi";
import VehicleType from "../../src/types/VehicleType";
import FuelType from "../../src/types/FuelType";

describe("fipeApi", () => {
  it("should request references", async () => {
    expect.assertions(1);

    expect(await getReferences()).toContainEqual({
      Codigo: 252,
      Mes: "março/2020 ",
    });
  });

  it("should request brands for cars", async () => {
    expect.assertions(1);

    expect(
      await getBrands({
        referenceId: 252,
        vehicleType: VehicleType.car,
      }),
    ).toContainEqual({ Label: "Suzuki", Value: "55" });
  });

  it("should request brands for motorcycles", async () => {
    expect.assertions(1);

    expect(
      await getBrands({
        referenceId: 252,
        vehicleType: VehicleType.motorcycle,
      }),
    ).toContainEqual({ Label: "SUZUKI", Value: "99" });
  });

  it("should request brands for trucks", async () => {
    expect.assertions(1);

    expect(
      await getBrands({
        referenceId: 252,
        vehicleType: VehicleType.trucks,
      }),
    ).toContainEqual({ Label: "FOTON", Value: "191" });
  });

  it("should request models for cars", async () => {
    expect.assertions(1);

    expect(
      await getModels({
        referenceId: 252,
        vehicleType: VehicleType.car,
        brandId: 55,
      }),
    ).toContainEqual({ Label: "Vitara JLX 2.0 V6 4x4", Value: 2200 });
  });

  it("should request models for motocycles", async () => {
    expect.assertions(1);

    expect(
      await getModels({
        referenceId: 252,
        vehicleType: VehicleType.motorcycle,
        brandId: 99,
      }),
    ).toContainEqual({ Label: "BURGMAN 650 EXECUTIVE/ 650", Value: 4581 });
  });

  it("should request models for trucks", async () => {
    expect.assertions(1);

    expect(
      await getModels({
        referenceId: 252,
        vehicleType: VehicleType.trucks,
        brandId: 191,
      }),
    ).toContainEqual({ Label: "10-16DT 3.8 4x2 Diesel(E5)", Value: 6904 });
  });

  it("should request year models for cars", async () => {
    expect.assertions(1);

    expect(
      await getYearModels({
        referenceId: 252,
        vehicleType: VehicleType.car,
        brandId: 55,
        modelId: 2200,
      }),
    ).toContainEqual({ Label: "1998 Gasolina", Value: "1998-1" });
  });

  it("should request year models for motoclycles", async () => {
    expect.assertions(1);

    expect(
      await getYearModels({
        referenceId: 252,
        vehicleType: VehicleType.motorcycle,
        brandId: 99,
        modelId: 4581,
      }),
    ).toContainEqual({ Label: "2019", Value: "2019-1" });
  });

  it("should request year models for trucks", async () => {
    expect.assertions(1);

    expect(
      await getYearModels({
        referenceId: 252,
        vehicleType: VehicleType.trucks,
        brandId: 191,
        modelId: 6904,
      }),
    ).toContainEqual({ Label: "2015", Value: "2015-3" });
  });

  it("should request year model for car", async () => {
    expect.assertions(1);

    expect(
      await getYearModel({
        referenceId: 252,
        vehicleType: VehicleType.car,
        brandId: 55,
        modelId: 2200,
        yearModelYear: 1998,
        yearModelFuelType: FuelType.gasolina,
      }),
    ).toMatchObject({
      AnoModelo: 1998,
      Autenticacao: "kcr610kp625h",
      CodigoFipe: "028017-8",
      Combustivel: "Gasolina",
      Marca: "Suzuki",
      MesReferencia: "março de 2020 ",
      Modelo: "Vitara JLX 2.0 V6 4x4",
      SiglaCombustivel: "G",
      TipoVeiculo: 1,
      Valor: "R$ 18.631,00",
    });
  });

  it("should request year model for motorcycle", async () => {
    expect.assertions(1);

    expect(
      await getYearModel({
        referenceId: 252,
        vehicleType: VehicleType.motorcycle,
        brandId: 99,
        modelId: 4581,
        yearModelYear: 2019,
        yearModelFuelType: FuelType.gasolina,
      }),
    ).toMatchObject({
      AnoModelo: 2019,
      Autenticacao: "vzbb5hmx1t8r",
      CodigoFipe: "825048-0",
      Combustivel: "Gasolina",
      Marca: "SUZUKI",
      MesReferencia: "março de 2020 ",
      Modelo: "BURGMAN 650 EXECUTIVE/ 650",
      SiglaCombustivel: "G",
      TipoVeiculo: 2,
      Valor: "R$ 44.009,00",
    });
  });

  it("should request year model for trucks", async () => {
    expect.assertions(1);

    expect(
      await getYearModel({
        referenceId: 252,
        vehicleType: VehicleType.trucks,
        brandId: 191,
        modelId: 6904,
        yearModelYear: 2015,
        yearModelFuelType: FuelType.diesel,
      }),
    ).toMatchObject({
      AnoModelo: 2015,
      Autenticacao: "640fb6mzmbwj",
      CodigoFipe: "526003-5",
      Combustivel: "Diesel",
      Marca: "FOTON",
      MesReferencia: "março de 2020 ",
      Modelo: "10-16DT 3.8 4x2 Diesel(E5)",
      SiglaCombustivel: "D",
      TipoVeiculo: 3,
      Valor: "R$ 73.577,00",
    });
  });
});
