const MockDate = require("mockdate");

const {
  startUpdateBrand,
} = require("../../../src/components/startUpdateBrand");
const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");
const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");
const { getBrand } = require("../../../src/repository/brands");
const { vehicleType } = require("../../../src/constants/vehicleType");

jest.mock("../../../src/api/fipeApi.js", () => ({
  getModels: () =>
    Promise.resolve([
      {
        Label: "100 2.8 V6",
        Value: 43,
      },
      {
        Label: "100 2.8 V6 Avant",
        Value: 44,
      },
    ]),
}));

describe("startUpdateBrand", () => {
  describe("when updating a brand", () => {
    const queueUrl = process.env.MODELS_QUEUE;

    const brand = {
      referenceId: 252,
      vehicleType: vehicleType.motorcycle,
      brandId: "61",
      brandName: "AGRALE",
    };

    beforeAll(async () => {
      MockDate.set("2020-01-01");
      await createPricesTable();
      await createQueue(queueUrl);
      await startUpdateBrand({ brand });
    });

    afterAll(async () => {
      await dropPricesTable();
      await deleteQueue(queueUrl);
      MockDate.reset();
    });

    it("should save the brand", async () => {
      expect.assertions(1);

      const persistedBrand = await getBrand(brand.vehicleType, brand.brandId);

      expect(persistedBrand).toEqual([
        {
          pk: "motorcycles",
          sk: "BRAND#61",
          name: "AGRALE",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ]);
    });

    it("should send models to queue", async () => {
      expect.assertions(2);

      const { Messages: messages } = await receiveMessage(queueUrl, 4);

      const messagesJson = messages.map((message) => JSON.parse(message.Body));

      expect(messagesJson.length).toEqual(2);

      expect(messagesJson).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            referenceId: 252,
            vehicleType: vehicleType.motorcycle,
            brandId: "61",
            modelId: 43,
            modelName: "100 2.8 V6",
          }),
          expect.objectContaining({
            referenceId: 252,
            vehicleType: vehicleType.motorcycle,
            brandId: "61",
            modelId: 44,
            modelName: "100 2.8 V6 Avant",
          }),
        ]),
      );
    });
  });
});
