const { checkForUpdate } = require("../components/checkForUpdate");
const { startUpdate } = require("../components/startUpdate");

const checkForUpdateHandler = async () => {
  try {
    await checkForUpdate();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

const startUpdateHandler = async event => {
  try {
    const { Records: messages } = event;

    await Promise.all(
      messages.map(async message => startUpdate(JSON.parse(message.body))),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "SQS event processed.",
        input: messages,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};

module.exports = { checkForUpdateHandler, startUpdateHandler };
