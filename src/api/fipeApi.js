const { makeRequest } = require("./makeRequest");

module.exports = {
  getReferences: async () => makeRequest("/ConsultarTabelaDeReferencia"),
  getBrands: async ({ referenceId, vehicleType }) =>
    makeRequest("/ConsultarMarcas", {
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleType,
    }),
  getModels: async ({ referenceId, vehicleType, brandId }) => {
    const response = await makeRequest("/ConsultarModelos", {
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleType,
      codigoMarca: brandId,
    });

    return response.Modelos;
  },
  getYearModels: async ({ referenceId, vehicleType, brandId, modelId }) =>
    makeRequest("/ConsultarAnoModelo", {
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleType,
      codigoMarca: brandId,
      codigoModelo: modelId,
    }),
  getYearModel: async ({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelYear,
    yearModelFuelType,
  }) =>
    makeRequest("/ConsultarValorComTodosParametros", {
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleType,
      codigoMarca: brandId,
      codigoModelo: modelId,
      anoModelo: yearModelYear,
      codigoTipoCombustivel: yearModelFuelType,
      tipoConsulta: "tradicional",
    }),
};
