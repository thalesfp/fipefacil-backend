import * as env from "env-var";
import * as queueManager from "./queueManager";

const QUEUE_NAME = env.get("REFERENCES_QUEUE").required().asString();

export type ReferenceQueueMessage = {
  id: number;
  month: number;
  year: number;
};

const sendMessage = async (message: ReferenceQueueMessage): Promise<void> => {
  await queueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};

export default sendMessage;
