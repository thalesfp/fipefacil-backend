import axios from "axios";
import querystring from "querystring";

import { vehicleTypeToNumber } from "../transformers/valuesToRemoteApi";
import VehicleType from "../types/VehicleType";
import {
  ReferenciasResponseType,
  MarcasResponseType,
  ModelosFullResponseType,
  ModelosResponseType,
  AnoModelosResponseType,
  AnoModeloResponseType,
} from "../types/FipeResponseTypes";

const BASE_URL = "https://veiculos.fipe.org.br";
const DEFAULT_TIMEOUT_IN_MS = 10_000;

const instance = axios.create({
  baseURL: `${BASE_URL}/api/veiculos`,
  timeout: DEFAULT_TIMEOUT_IN_MS,
  headers: {
    Referer: BASE_URL,
    "content-type": "application/x-www-form-urlencoded",
  },
});

export const getReferences = async (): Promise<ReferenciasResponseType[]> => {
  const response = await instance.post<ReferenciasResponseType[]>(
    "/ConsultarTabelaDeReferencia",
  );

  return response.data;
};

export const getBrands = async ({
  referenceId,
  vehicleType,
}: {
  referenceId: number;
  vehicleType: VehicleType;
}): Promise<MarcasResponseType[]> => {
  const response = await instance.post<MarcasResponseType[]>(
    "/ConsultarMarcas",
    querystring.stringify({
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleTypeToNumber(vehicleType),
    }),
  );

  return response.data;
};

export const getModels = async ({
  referenceId,
  vehicleType,
  brandId,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
}): Promise<ModelosResponseType[]> => {
  const response = await instance.post<ModelosFullResponseType>(
    "/ConsultarModelos",
    querystring.stringify({
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleTypeToNumber(vehicleType),
      codigoMarca: brandId,
    }),
  );

  return response.data.Modelos;
};

export const getYearModels = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
}): Promise<AnoModelosResponseType[]> => {
  const response = await instance.post<AnoModelosResponseType[]>(
    "/ConsultarAnoModelo",
    querystring.stringify({
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleTypeToNumber(vehicleType),
      codigoMarca: brandId,
      codigoModelo: modelId,
    }),
  );

  return response.data;
};

export const getYearModel = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelYear,
  yearModelFuelType,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  yearModelYear: number;
  yearModelFuelType: number;
}): Promise<AnoModeloResponseType> => {
  const response = await instance.post<AnoModeloResponseType>(
    "/ConsultarValorComTodosParametros",
    querystring.stringify({
      codigoTabelaReferencia: referenceId,
      codigoTipoVeiculo: vehicleTypeToNumber(vehicleType),
      codigoMarca: brandId,
      codigoModelo: modelId,
      anoModelo: yearModelYear,
      codigoTipoCombustivel: yearModelFuelType,
      tipoConsulta: "tradicional",
    }),
  );

  return response.data;
};
