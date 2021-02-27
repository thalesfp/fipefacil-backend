import * as ReferenceRepository from "../repository/referenceRepository";
import * as BrandQueue from "../queue/brandQueue";
import * as FipeApi from "../services/fipeApi";
import { normalizeBrands } from "../transformers/valuesFromRemoteApi";
import VehicleType from "../types/VehicleType";
import { ReferenceQueueMessage } from "../queue/referenceQueue";

const startUpdateReference = async (
  reference: ReferenceQueueMessage,
): Promise<void> => {
  await ReferenceRepository.createReference(reference);

  await Promise.all(
    [VehicleType.car, VehicleType.motorcycle, VehicleType.truck].map(
      async (type) => {
        const brands = await FipeApi.getBrands({
          referenceId: reference.id,
          vehicleType: type,
        });

        const normalizedBrands = normalizeBrands(brands);

        await Promise.all(
          normalizedBrands.map(async (brand) =>
            BrandQueue.sendMessage({
              referenceId: reference.id,
              vehicleType: type,
              brandId: brand.id,
              brandName: brand.name,
            }),
          ),
        );
      },
    ),
  );
};

export default startUpdateReference;
