import { SQS } from "aws-sdk";
import * as env from "env-var";

const sqs = new SQS({
  endpoint: env.get("AWS_SQS_ENDPOINT").required().asString(),
  region: env.get("AWS_REGION").required().asString(),
});

export const createQueue = async (queueUrl: string): Promise<void> => {
  const queueName = queueUrl.split("/")[queueUrl.split("/").length - 1];

  const params = {
    QueueName: queueName,
  };

  await sqs.createQueue(params).promise();
};

export const deleteQueue = async (queueUrl: string): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
  };

  await sqs.deleteQueue(params).promise();
};

export const sendMessage = async (
  queueUrl: string,
  message: string,
): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: message,
  };

  await sqs.sendMessage(params).promise();
};

export const receiveMessage = async (
  queueUrl: string,
  maxNumberOfMessages = 1,
): Promise<string[]> => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxNumberOfMessages,
  };

  const message = await sqs.receiveMessage(params).promise();

  if (!message.Messages) return [];

  return message.Messages.map((message) => message.Body ?? "");
};

export const queueNumberOfMessages = async (
  queueUrl: string,
): Promise<void> => {
  const params = {
    QueueUrl: queueUrl,
    AttributeNames: ["ApproximateNumberOfMessages"],
  };

  await sqs.getQueueAttributes(params).promise();
};
