import * as env from "env-var";
import * as QueueManager from "./queueManager";

const QUEUE_NAME = env.get("REFERENCES_QUEUE").required().asString();

export type ReferenceQueueMessage = {
  id: number;
  month: number;
  year: number;
};

export const sendMessage = async (
  message: ReferenceQueueMessage,
): Promise<void> => {
  await QueueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};
