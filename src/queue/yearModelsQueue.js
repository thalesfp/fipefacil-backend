const queueManager = require("./queueManager");

const QUEUE_NAME = process.env.YEAR_MODELS_QUEUE;

const sendMessage = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}) => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelId,
    yearModelYear,
    yearModelFuelType,
  });

  return queueManager.sendMessage(QUEUE_NAME, message);
};

module.exports = {
  sendMessage,
};
