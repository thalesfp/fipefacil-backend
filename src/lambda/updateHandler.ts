import { APIGatewayProxyHandler, SQSHandler } from "aws-lambda";

import checkForUpdate from "../components/checkForUpdate";
import startUpdateReference from "../components/startUpdateReference";
import startUpdateBrand from "../components/startUpdateBrand";
import startUpdateModel from "../components/startUpdateModel";
import startUpdateYearModel from "../components/startUpdateYearModel";
import createUpdateFiles from "../components/createUpdateFiles";

import { ReferenceQueueMessage } from "../queue/referencesQueue";
import { BrandQueueMessage } from "../queue/brandsQueue";
import { ModelQueueMessage } from "../queue/modelsQueue";
import { YearModelQueueMessage } from "../queue/yearModelsQueue";

export const checkForUpdateHandler: APIGatewayProxyHandler = async () => {
  try {
    const response = await checkForUpdate();

    return {
      statusCode: 200,
      body: JSON.stringify({ needUpdate: response }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const startUpdateReferenceHandler: SQSHandler = async (event) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateReference(JSON.parse(message.body) as ReferenceQueueMessage),
      ),
    );
  } catch (error) {
    console.error("ERROR: startUpdateReferenceHandler");
    console.error(error);

    throw error;
  }
};

export const startUpdateBrandHandler: SQSHandler = async (event) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateBrand(JSON.parse(message.body) as BrandQueueMessage),
      ),
    );
  } catch (error) {
    console.error("ERROR: startUpdateBrandHandler");
    console.error(error);

    throw error;
  }
};

export const startUpdateModelHandler: SQSHandler = async (event) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateModel(JSON.parse(message.body) as ModelQueueMessage),
      ),
    );
  } catch (error) {
    console.error("ERROR: startUpdateModelHandler");
    console.error(error);

    throw error;
  }
};

export const startUpdateYearModelHandler: SQSHandler = async (event) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateYearModel(JSON.parse(message.body) as YearModelQueueMessage),
      ),
    );
  } catch (error) {
    console.error("ERROR: startUpdateYearModelHandler");
    console.error(error);

    throw error;
  }
};

export const createUpdateFilesHandler: APIGatewayProxyHandler = async () => {
  try {
    await createUpdateFiles();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ status: "success" }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode ?? 500,
      body: error,
    };
  }
};
