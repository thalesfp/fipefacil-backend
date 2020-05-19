import queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";
import FuelType from "../types/FuelType";

const QUEUE_NAME = process.env.YEAR_MODELS_QUEUE;

const sendMessage = async ({
  referenceId,
  vehicleType,
  brandId,
  modelId,
  yearModelId,
  yearModelYear,
  yearModelFuelType,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  modelId: number;
  yearModelId: number;
  yearModelYear: number;
  yearModelFuelType: FuelType;
}): Promise<void> => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelId,
    yearModelYear,
    yearModelFuelType,
  });

  await queueManager.sendMessage(QUEUE_NAME, message);
};

export default sendMessage;
