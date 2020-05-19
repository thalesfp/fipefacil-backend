import queueManager from "./queueManager";
import VehicleType from "../types/VehicleType";

const QUEUE_NAME = process.env.BRANDS_QUEUE;

const sendMessage = async ({
  referenceId,
  vehicleType,
  brandId,
  brandName,
}: {
  referenceId: number;
  vehicleType: VehicleType;
  brandId: number;
  brandName: string;
}): Promise<void> => {
  const message = JSON.stringify({
    referenceId,
    vehicleType,
    brandId,
    brandName,
  });

  await queueManager.sendMessage(QUEUE_NAME, message);
};

export default sendMessage;
