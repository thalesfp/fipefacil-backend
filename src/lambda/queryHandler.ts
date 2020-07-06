import { APIGatewayProxyHandler } from "aws-lambda";

import { getCurrentReference } from "../repository/references";
import { getBrands } from "../repository/brands";
import { getModels } from "../repository/models";
import { getYearModels } from "../repository/yearModels";
import { numberToVehicleType } from "../transformers/valuesToRemoteApi";

export const queryCurrentReference: APIGatewayProxyHandler = async () => {
  try {
    const currentReference = await getCurrentReference();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(currentReference),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};

export const queryBrands: APIGatewayProxyHandler = async (event) => {
  try {
    const vehicleTypeParam = event.pathParameters?.vehicleType;
    if (!vehicleTypeParam) throw Error("Parameter missing: vehicleType");

    const vehicleType = numberToVehicleType(parseInt(vehicleTypeParam, 10));
    const brands = await getBrands(vehicleType);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(brands),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};

export const queryModels: APIGatewayProxyHandler = async (event) => {
  try {
    const brandIdParam = event.pathParameters?.brandIdParam;
    if (!brandIdParam) throw Error("Parameter missing: brandIdParam");

    const brandId = parseInt(brandIdParam, 10);
    const models = await getModels(brandId);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(models),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};

export const queryYearModels: APIGatewayProxyHandler = async (event) => {
  try {
    const modelIdParam = event.pathParameters?.modelIdParam;
    if (!modelIdParam) throw Error("Parameter missing: brandIdParam");

    const modelId = parseInt(modelIdParam, 10);
    const yearModels = await getYearModels(modelId);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(yearModels),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};
