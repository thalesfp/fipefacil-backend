import * as env from "env-var";
import * as queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";
import FuelType from "../types/FuelType";

const QUEUE_NAME = env.get("YEAR_MODELS_QUEUE").required().asString();

export type YearModelQueueMessage = {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  yearModelId: string;
  yearModelYear: number;
  yearModelFuelType: FuelType;
};

const sendMessage = async (message: YearModelQueueMessage): Promise<void> => {
  await queueManager.sendMessage(QUEUE_NAME, JSON.stringify(message));
};

export default sendMessage;
