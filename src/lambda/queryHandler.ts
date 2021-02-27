import { APIGatewayProxyHandler } from "aws-lambda";

import * as ReferenceRepository from "../repository/referenceRepository";
import * as BrandRepository from "../repository/brandRepository";
import * as ModelRepository from "../repository/modelRepository";
import * as YearModelRepository from "../repository/yearModelRepository";
import { numberToVehicleType } from "../transformers/valuesToRemoteApi";

export const queryCurrentReference: APIGatewayProxyHandler = async () => {
  const currentReference = await ReferenceRepository.getCurrentReference();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(currentReference),
  };
};

export const queryBrands: APIGatewayProxyHandler = async (event) => {
  const vehicleTypeParam = event.pathParameters?.vehicleType;
  if (!vehicleTypeParam) throw Error("Parameter missing: vehicleType");

  const vehicleType = numberToVehicleType(parseInt(vehicleTypeParam, 10));
  const brands = await BrandRepository.getBrands(vehicleType);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(brands),
  };
};

export const queryModels: APIGatewayProxyHandler = async (event) => {
  const brandIdParam = event.pathParameters?.brandId;
  if (!brandIdParam) throw Error("Parameter missing: brandId");

  const brandId = parseInt(brandIdParam, 10);
  const models = await ModelRepository.getModels(brandId);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(models),
  };
};

export const queryYearModels: APIGatewayProxyHandler = async (event) => {
  const modelIdParam = event.pathParameters?.modelId;
  if (!modelIdParam) throw Error("Parameter missing: brandId");

  const modelId = parseInt(modelIdParam, 10);
  const yearModels = await YearModelRepository.getYearModels(modelId);

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(yearModels),
  };
};
