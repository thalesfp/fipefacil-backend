/* eslint-disable no-console */
const { checkForUpdate } = require("../components/checkForUpdate");
const { startUpdateReference } = require("../components/startUpdateReference");
const { startUpdateBrand } = require("../components/startUpdateBrand");
const { startUpdateModel } = require("../components/startUpdateModel");

const checkForUpdateHandler = async () => {
  try {
    await checkForUpdate();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateReferenceHandler = async event => {
  try {
    console.info("START: startUpdateReferenceHandler");
    console.info(event);

    const { Records: messages } = event;

    await Promise.all(
      messages.map(async message =>
        startUpdateReference(JSON.parse(message.body)),
      ),
    );

    console.info("FINISH: startUpdateReferenceHandler");
    console.info(messages);

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
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateBrandHandler = async event => {
  try {
    console.info("START: startUpdateBrandHandler");
    console.info(event);

    const { Records: messages } = event;

    await Promise.all(
      messages.map(async message => startUpdateBrand(JSON.parse(message.body))),
    );

    console.info("FINISH: startUpdateBrandHandler");
    console.info(messages);

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
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateModelHandler = async event => {
  try {
    console.info("START: startUpdateModelHandler");
    console.info(event);

    const { Records: messages } = event;

    await Promise.all(
      messages.map(async message => startUpdateModel(JSON.parse(message.body))),
    );

    console.info("FINISH: startUpdateModelHandler");
    console.info(messages);

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
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  checkForUpdateHandler,
  startUpdateReferenceHandler,
  startUpdateBrandHandler,
  startUpdateModelHandler,
};
