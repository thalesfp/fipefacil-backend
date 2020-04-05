/* eslint-disable no-console */
const { checkForUpdate } = require("../components/checkForUpdate");
const { startUpdateReference } = require("../components/startUpdateReference");
const { startUpdateBrand } = require("../components/startUpdateBrand");
const { startUpdateModel } = require("../components/startUpdateModel");
const { startUpdateYearModel } = require("../components/startUpdateYearModel");

const apiTimeout = (lambdaRemainingTimeInMills) =>
  lambdaRemainingTimeInMills - 500;

const checkForUpdateHandler = async (event, context) => {
  try {
    await checkForUpdate({
      apiTimeout: apiTimeout(context.getRemainingTimeInMills()),
    });

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

const startUpdateReferenceHandler = async (event, context) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateReference({
          reference: JSON.parse(message.body),
          apiTimeout: apiTimeout(context.getRemainingTimeInMills()),
        }),
      ),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: messages,
      }),
    };
  } catch (error) {
    console.error("ERROR: startUpdateReferenceHandler");
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateBrandHandler = async (event, context) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateBrand({
          brand: JSON.parse(message.body),
          apiTimeout: apiTimeout(context.getRemainingTimeInMills()),
        }),
      ),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: messages,
      }),
    };
  } catch (error) {
    console.error("ERROR: startUpdateBrandHandler");
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateModelHandler = async (event, context) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateModel({
          model: JSON.parse(message.body),
          apiTimeout: apiTimeout(context.getRemainingTimeInMills()),
        }),
      ),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: messages,
      }),
    };
  } catch (error) {
    console.error("ERROR: startUpdateModelHandler");
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateYearModelHandler = async (event, context) => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async (message) =>
        startUpdateYearModel({
          yearModel: JSON.parse(message.body),
          apiTimeout: apiTimeout(context.getRemainingTimeInMills()),
        }),
      ),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: messages,
      }),
    };
  } catch (error) {
    console.error("ERROR: startUpdateYearModelHandler");
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  checkForUpdateHandler,
  startUpdateReferenceHandler,
  startUpdateBrandHandler,
  startUpdateModelHandler,
  startUpdateYearModelHandler,
};
