const queueManager = require("./queueManager");

const QUEUE_NAME = process.env.REFERENCES_QUEUE;

const sendMessage = async (id, month, year) => {
  const message = JSON.stringify({
    id,
    month,
    year,
  });

  return queueManager.sendMessage(QUEUE_NAME, message);
};

module.exports = {
  sendMessage,
};
