const { SQS } = require("aws-sdk");

const sqs = new SQS({
  endpoint: process.env.AWS_SQS_ENDPOINT,
  region: process.env.AWS_REGION,
});

const createQueue = async queueUrl => {
  const queueName = queueUrl.split("/")[queueUrl.split("/").length - 1];

  const params = {
    QueueName: queueName,
  };

  return sqs.createQueue(params).promise();
};

const deleteQueue = async queueUrl => {
  const params = {
    QueueUrl: queueUrl,
  };

  return sqs.deleteQueue(params).promise();
};

const sendMessage = async (queueUrl, message) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: message,
  };

  return sqs.sendMessage(params).promise();
};

const receiveMessage = async (queueUrl, maxNumberOfMessages = 1) => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: String(maxNumberOfMessages),
  };

  return sqs.receiveMessage(params).promise();
};

const queueNumberOfMessages = async queueUrl => {
  const params = {
    QueueUrl: queueUrl,
    AttributeNames: ["ApproximateNumberOfMessages"],
  };

  return sqs.getQueueAttributes(params).promise();
};

module.exports = {
  createQueue,
  deleteQueue,
  sendMessage,
  receiveMessage,
  queueNumberOfMessages,
};
