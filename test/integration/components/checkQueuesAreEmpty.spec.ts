import * as env from "env-var";
import checkQueuesAreEmpty from "../../../src/components/checkQueuesAreEmpty";
import { createQueue, deleteQueue } from "../../../src/queue/queueManager";
import * as brandQueue from "../../../src/queue/brandQueue";
import VehicleType from "../../../src/types/VehicleType";

describe("checkQueuesAreEmpty", () => {
  const referencesQueueUrl = env.get("REFERENCES_QUEUE").required().asString();
  const brandsQueueUrl = env.get("BRANDS_QUEUE").required().asString();
  const modelsQueueUrl = env.get("MODELS_QUEUE").required().asString();
  const yearModelsQueueUrl = env.get("YEAR_MODELS_QUEUE").required().asString();

  beforeAll(async () => {
    await createQueue(referencesQueueUrl);
    await createQueue(brandsQueueUrl);
    await createQueue(modelsQueueUrl);
    await createQueue(yearModelsQueueUrl);
  });

  afterAll(async () => {
    await deleteQueue(referencesQueueUrl);
    await deleteQueue(brandsQueueUrl);
    await deleteQueue(modelsQueueUrl);
    await deleteQueue(yearModelsQueueUrl);
  });

  it("should return true when all queues are empty", async () => {
    expect.assertions(1);

    const response = await checkQueuesAreEmpty();

    expect(response).toEqual(true);
  });

  it("should return false when one or more queues are not empty", async () => {
    expect.assertions(1);

    const message = {
      referenceId: 1234,
      vehicleType: VehicleType.car,
      brandId: 100,
      brandName: "Ford",
    };

    await brandQueue.sendMessage(message);

    const response = await checkQueuesAreEmpty();

    expect(response).toEqual(false);
  });
});
