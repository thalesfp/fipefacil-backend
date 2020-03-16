const queueManager = require("./queueManager");

const QUEUE_NAME = process.env.MODELS_QUEUE;

const sendMessage = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  modelName,
}) => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    modelName,
  });

  return queueManager.sendMessage(QUEUE_NAME, message);
};

module.exports = {
  sendMessage,
};
