import * as FipeApi from "../services/fipeApi";
import * as BrandRepository from "../repository/brandRepository";
import * as ModelQueue from "../queue/modelQueue";
import { normalizeBrandName } from "../transformers/brandsFromRemoteApi";
import { normalizeModels } from "../transformers/valuesFromRemoteApi";
import { BrandQueueMessage } from "../queue/brandQueue";

const startUpdateBrand = async ({
  referenceId,
  vehicleType,
  brandId,
  brandName,
}: BrandQueueMessage): Promise<void> => {
  await BrandRepository.createBrand({
    id: brandId,
    name: normalizeBrandName(brandName),
    vehicleType,
    popular: false,
  });

  const models = await FipeApi.getModels({
    referenceId,
    vehicleType,
    brandId,
  });
  const normalizedModels = normalizeModels(models);

  await Promise.all(
    normalizedModels.map(async (model) =>
      ModelQueue.sendMessage({
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
