const AWS = require("aws-sdk");

const sqs = new AWS.SQS({
  endpoint: process.env.AWS_SQS_ENDPOINT,
  region: process.env.AWS_REGION,
});

const createQueue = async queueName => {
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

  const response = await sqs.receiveMessage(params).promise();

  return response;
};

module.exports = {
  createQueue,
  deleteQueue,
  sendMessage,
  receiveMessage,
};
