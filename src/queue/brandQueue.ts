import * as env from "env-var";
import * as QueueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = env.get("BRANDS_QUEUE").required().asString();

export type BrandQueueMessage = {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  brandName: string;
};

export const sendMessage = async (
  message: BrandQueueMessage,
): Promise<void> => {
  await QueueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};

export const numberOfMessages = async (): Promise<number> => {
  return QueueManager.queueNumberOfMessages(QUEUE_NAME);
};
