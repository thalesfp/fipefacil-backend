const queueManager = require("./queueManager");

const QUEUE_NAME = process.env.BRANDS_QUEUE;

const sendMessage = async (referenceId, vehicleType, brandId, brandName) => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    brandName,
  });

  return queueManager.sendMessage(QUEUE_NAME, message);
};

module.exports = {
  sendMessage,
};
