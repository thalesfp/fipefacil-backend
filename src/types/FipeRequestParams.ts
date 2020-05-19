export interface ApiBaseParamsType {
  codigoTabelaReferencia: string;
  codigoTipoVeiculo: string;
}

export interface ApiModelsParamsType extends ApiBaseParamsType {
  codigoMarca: string;
}

export interface ApiYearModelsParamsType extends ApiBaseParamsType {
  codigoMarca: string;
  codigoModelo: string;
}

export interface ApiYearModelParamsType extends ApiBaseParamsType {
  codigoMarca: string;
  codigoModelo: string;
  anoModelo: string;
  codigoTipoCombustivel: string;
  tipoConsulta: string;
}
