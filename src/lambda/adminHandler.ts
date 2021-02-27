import { APIGatewayProxyHandler } from "aws-lambda";

import * as ReferenceRepository from "../repository/referenceRepository";
import * as BrandRepository from "../repository/brandRepository";
import { numberToVehicleType } from "../transformers/valuesToRemoteApi";

export const getAllReferencesHandler: APIGatewayProxyHandler = async () => {
  try {
    const response = await ReferenceRepository.getAllReferences();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const getAllBrandsHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const vehicleTypeParam = event.pathParameters?.vehicleType;
    if (!vehicleTypeParam) throw Error("Parameter missing: vehicleType");

    const vehicleType = numberToVehicleType(parseInt(vehicleTypeParam, 10));

    const response = await BrandRepository.getBrands(vehicleType);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const updateBrandHandler: APIGatewayProxyHandler = async (event) => {
  try {
    return {
      statusCode: 204,
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
