import { getModels } from "../services/fipeApi";
import {
  normalizeBrandName,
  isPopularBrand,
} from "../transformers/brandsFromRemoteApi";
import { normalizeModels } from "../transformers/valuesFromRemoteApi";
import { createBrand } from "../repository/brands";
import sendMessage from "../queue/modelsQueue";
import { BrandQueueMessage } from "../queue/brandsQueue";

const startUpdateBrand = async ({
  referenceId,
  vehicleType,
  brandId,
  brandName,
}: BrandQueueMessage): Promise<void> => {
  await createBrand({
    id: brandId,
    name: normalizeBrandName(brandName),
    vehicleType,
    popular: isPopularBrand(brandName),
  });

  const models = await getModels({
    referenceId,
    vehicleType,
    brandId,
  });
  const normalizedModels = normalizeModels(models);

  await Promise.all(
    normalizedModels.map(async (model) =>
      sendMessage({
        referenceId,
        vehicleType,
        brandId,
        modelId: model.id,
        modelName: model.name,
      }),
    ),
  );
};

export default startUpdateBrand;
