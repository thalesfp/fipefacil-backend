import * as env from "env-var";
import * as queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = env.get("BRANDS_QUEUE").required().asString();

export type BrandQueueMessage = {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  brandName: string;
};

const sendMessage = async (message: BrandQueueMessage): Promise<void> => {
  await queueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};

export default sendMessage;
