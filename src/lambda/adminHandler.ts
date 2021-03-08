import { APIGatewayProxyHandler } from "aws-lambda";

import * as ReferenceRepository from "../repository/referenceRepository";
import * as BrandRepository from "../repository/brandRepository";
import { numberToVehicleType } from "../transformers/valuesToRemoteApi";
import { updateBrand } from "../components/updateBrand";
import { BrandUpdate } from "../types/DatabaseTypes";

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
    const vehicleTypeParam = event.pathParameters?.vehicleType;
    if (!vehicleTypeParam) throw new Error("Parameter missing: vehicleType");

    const brandIdParam = event.pathParameters?.brandId;
    if (!brandIdParam) throw new Error("Parameter missing: brandId");

    const brandParam = event.body;
    if (!brandParam) throw new Error("Parameter missing: brand");

    const vehicleType = numberToVehicleType(parseInt(vehicleTypeParam, 10));
    const brandId = parseInt(brandIdParam);
    const brand = JSON.parse(brandParam) as BrandUpdate;

    const updatedBrand = await updateBrand(vehicleType, brandId, brand);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(updatedBrand),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
