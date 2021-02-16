import { APIGatewayProxyHandler } from "aws-lambda";

import * as ReferenceRepository from "../repository/references";

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
