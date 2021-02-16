import * as env from "env-var";
import * as QueueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = env.get("MODELS_QUEUE").required().asString();

export type ModelQueueMessage = {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  modelName: string;
};

export const sendMessage = async (
  message: ModelQueueMessage,
): Promise<void> => {
  await QueueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};
