import queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = process.env.MODELS_QUEUE;

const sendMessage = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  modelName,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  modelName: string;
}): Promise<void> => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    modelName,
  });

  await queueManager.sendMessage(QUEUE_NAME, message);
};

export default sendMessage;
