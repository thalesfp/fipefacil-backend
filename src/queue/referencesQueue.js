const queueManager = require("./queueManager");

const QUEUE_NAME = process.env.REFERENCES_QUEUE;

const sendMessage = async (referenceId, month, year) => {
  const message = JSON.stringify({
    referenceId,
    month,
    year,
  });

  return queueManager.sendMessage(QUEUE_NAME, message);
};

module.exports = {
  sendMessage,
};
