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
    const vehicleType = numberToVehicleType(
      parseInt(event.pathParameters.vehicleType, 10),
    );
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
    const brandId = parseInt(event.pathParameters.brandId, 10);
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
    const modelId = parseInt(event.pathParameters.modelId, 10);
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
