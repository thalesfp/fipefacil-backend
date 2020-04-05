const { makeFipeRequest } = require("./makeFipeRequest");

module.exports = {
  getReferences: async ({ timeout }) =>
    makeFipeRequest({
      path: "/ConsultarTabelaDeReferencia",
      timeout,
    }),
  getBrands: async ({ params: { referenceId, vehicleType }, timeout }) =>
    makeFipeRequest({
      path: "/ConsultarMarcas",
      body: {
        codigoTabelaReferencia: referenceId,
        codigoTipoVeiculo: vehicleType,
      },
      timeout,
    }),
  getModels: async ({
    params: { referenceId, vehicleType, brandId },
    timeout,
  }) => {
    const response = await makeFipeRequest({
      path: "/ConsultarModelos",
      body: {
        codigoTabelaReferencia: referenceId,
        codigoTipoVeiculo: vehicleType,
        codigoMarca: brandId,
      },
      timeout,
    });

    return response.Modelos;
  },
  getYearModels: async ({
    params: { referenceId, vehicleType, brandId, modelId },
    timeout,
  }) =>
    makeFipeRequest({
      path: "/ConsultarAnoModelo",
      body: {
        codigoTabelaReferencia: referenceId,
        codigoTipoVeiculo: vehicleType,
        codigoMarca: brandId,
        codigoModelo: modelId,
      },
      timeout,
    }),
  getYearModel: async ({
    params: {
      referenceId,
      vehicleType,
      brandId,
      modelId,
      yearModelYear,
      yearModelFuelType,
    },
    timeout,
  }) =>
    makeFipeRequest({
      path: "/ConsultarValorComTodosParametros",
      body: {
        codigoTabelaReferencia: referenceId,
        codigoTipoVeiculo: vehicleType,
        codigoMarca: brandId,
        codigoModelo: modelId,
        anoModelo: yearModelYear,
        codigoTipoCombustivel: yearModelFuelType,
        tipoConsulta: "tradicional",
      },
      timeout,
    }),
};
