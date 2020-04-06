const fipeApi = require("../../src/api/fipeApi");
const { vehicleType } = require("../../src/constants/vehicleType");

describe("fipeApi", () => {
  it("should request references", async () => {
    expect.assertions(1);

    expect(await fipeApi.getReferences({})).toContainEqual({
      Codigo: 252,
      Mes: "março/2020 ",
    });
  });

  it("should request brands for cars", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getBrands({
        params: { referenceId: 252, vehicleType: vehicleType.car },
      }),
    ).toContainEqual({ Label: "Suzuki", Value: "55" });
  });

  it("should request brands for motorcycles", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getBrands({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
        },
      }),
    ).toContainEqual({ Label: "SUZUKI", Value: "99" });
  });

  it("should request models for cars", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getModels({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.car,
          brandId: 55,
        },
      }),
    ).toContainEqual({ Label: "Vitara JLX 2.0 V6 4x4", Value: 2200 });
  });

  it("should request models for motocycles", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getModels({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
          brandId: 99,
        },
      }),
    ).toContainEqual({ Label: "BURGMAN 650 EXECUTIVE/ 650", Value: 4581 });
  });

  it("should request year models for cars", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getYearModels({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.car,
          brandId: 55,
          modelId: 2200,
        },
      }),
    ).toContainEqual({ Label: "1998 Gasolina", Value: "1998-1" });
  });

  it("should request year models for motoclycles", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getYearModels({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
          brandId: 99,
          modelId: 4581,
        },
      }),
    ).toContainEqual({ Label: "2019", Value: "2019-1" });
  });

  it("should request year model for car", async () => {
    expect.assertions(1);

    expect(
      await fipeApi.getYearModel({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.car,
          brandId: 55,
          modelId: 2200,
          yearModelYear: 1998,
          yearModelFuelType: 1,
        },
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
      await fipeApi.getYearModel({
        params: {
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
          brandId: 99,
          modelId: 4581,
          yearModelYear: 2019,
          yearModelFuelType: 1,
        },
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

  it("should have timeout error", async () => {
    expect.assertions(1);

    await expect(fipeApi.getReferences({ timeout: 1 })).rejects.toEqual(
      "socket hang up",
    );
  });
});
