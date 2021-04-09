import * as env from "env-var";
import * as queue from "../../../src/queue/brandQueue";
import * as QueueManager from "../../../src/queue/queueManager";
import VehicleType from "../../../src/types/VehicleType";

describe("queue", () => {
  describe("brandQueue", () => {
    const queueUrl = env.get("BRANDS_QUEUE").required().asString();

    beforeEach(async () => {
      await QueueManager.createQueue(queueUrl);
    });

    afterEach(async () => {
      await QueueManager.deleteQueue(queueUrl);
    });

    it("should return number of messages available", async () => {
      expect.assertions(1);

      const message1 = {
        referenceId: 1234,
        vehicleType: VehicleType.car,
        brandId: 100,
        brandName: "Ford",
      };

      await queue.sendMessage(message1);
      await queue.sendMessage(message1);
      await queue.sendMessage(message1);

      const numberOfMessages = await queue.numberOfMessages();

      expect(numberOfMessages).toEqual(3);
    });
  });
});
