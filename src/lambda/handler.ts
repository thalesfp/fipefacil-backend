import { APIGatewayProxyHandler, SQSHandler } from "aws-lambda";

import checkForUpdate from "../components/checkForUpdate";
import startUpdateReference from "../components/startUpdateReference";
import startUpdateBrand from "../components/startUpdateBrand";
import startUpdateModel from "../components/startUpdateModel";
import startUpdateYearModel from "../components/startUpdateYearModel";

export const checkForUpdateHandler: APIGatewayProxyHandler = async () => {
  try {
    await checkForUpdate();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
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
        startUpdateReference(JSON.parse(message.body)),
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
        startUpdateBrand(JSON.parse(message.body)),
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
        startUpdateModel(JSON.parse(message.body)),
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
        startUpdateYearModel(JSON.parse(message.body)),
      ),
    );
  } catch (error) {
    console.error("ERROR: startUpdateYearModelHandler");
    console.error(error);

    throw error;
  }
};
