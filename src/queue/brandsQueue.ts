import * as queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = process.env.BRANDS_QUEUE;

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
