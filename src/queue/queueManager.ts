import { SQS } from "aws-sdk";

const sqs = new SQS({
  endpoint: process.env.AWS_SQS_ENDPOINT,
  region: process.env.AWS_REGION,
});

const createQueue = async (queueUrl: string): Promise<void> => {
  const queueName = queueUrl.split("/")[queueUrl.split("/").length - 1];

  const params = {
    QueueName: queueName,
  };

  await sqs.createQueue(params).promise();
};

const deleteQueue = async (queueUrl: string): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
  };

  await sqs.deleteQueue(params).promise();
};

const sendMessage = async (
  queueUrl: string,
  message: string,
): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: message,
  };

  await sqs.sendMessage(params).promise();
};

const receiveMessage = async (
  queueUrl: string,
  maxNumberOfMessages = 1,
): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxNumberOfMessages,
  };

  await sqs.receiveMessage(params).promise();
};

const queueNumberOfMessages = async (queueUrl: string): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
    AttributeNames: ["ApproximateNumberOfMessages"],
  };

  await sqs.getQueueAttributes(params).promise();
};

export default {
  createQueue,
  deleteQueue,
  sendMessage,
  receiveMessage,
  queueNumberOfMessages,
};
