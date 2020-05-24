import sendMessage from "../queue/brandsQueue";
import { getBrands } from "../api/fipeApi";
import { createReference } from "../repository/references";
import { normalizeBrands } from "../transformers/valuesFromRemoteApi";
import { VehicleType } from "../types/VehicleType";

const startUpdateReference = async (
  reference: ReferenceType,
): Promise<void> => {
  await createReference(reference);

  await Promise.all(
    [VehicleType.car, VehicleType.motorcycle, VehicleType.trucks].map(
      async (type) => {
        const brands = await getBrands({
          referenceId: reference.id,
          vehicleType: type,
        });

        const normalizedBrands = normalizeBrands(brands);

        await Promise.all(
          normalizedBrands.map(async (brand) =>
            sendMessage({
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
