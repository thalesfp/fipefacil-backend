const {
  startUpdateModel,
} = require("../../../src/components/startUpdateModel");
const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");
const { getModels } = require("../../../src/repository/models");

const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");
const { vehicleType } = require("../../../src/constants/vehicleType");

jest.mock("../../../src/api/fipeApi.js", () => ({
  getYearModels: () =>
    Promise.resolve([
      {
        Label: "1995 Gasolina",
        Value: "1995-1",
      },
      {
        Label: "1994 Gasolina",
        Value: "1994-1",
      },
    ]),
}));

describe("startUpdateModel", () => {
  describe("when updating a model", () => {
    const queueUrl = process.env.YEAR_MODELS_QUEUE;

    const model = {
      referenceId: 252,
      vehicleType: vehicleType.motorcycle,
      brandId: "61",
      modelId: 43,
      modelName: "100 2.8 V6",
    };

    beforeAll(async () => {
      await createPricesTable();
      await createQueue(queueUrl);
      await startUpdateModel({ model });
    });

    afterAll(async () => {
      await dropPricesTable();
      await deleteQueue(queueUrl);
    });

    it("should save the model", async () => {
      expect.assertions(1);

      const models = await getModels(model.brandId);

      const expectedResponse = [
        {
          sk: "MODEL#43",
          name: "100 2.8 V6",
        },
      ];

      expect(models).toEqual(expectedResponse);
    });

    it("should send year models to queue", async () => {
      expect.assertions(2);

      const { Messages: messages } = await receiveMessage(queueUrl, 2);

      const messagesJson = messages.map((message) => JSON.parse(message.Body));

      expect(messagesJson.length).toEqual(2);

      expect(messagesJson).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            referenceId: 252,
            vehicleType: vehicleType.motorcycle,
            brandId: "61",
            modelId: 43,
            yearModelId: "1995-1",
            yearModelYear: "1995",
            yearModelFuelType: "1",
          }),
          expect.objectContaining({
            referenceId: 252,
            vehicleType: vehicleType.motorcycle,
            brandId: "61",
            modelId: 43,
            yearModelId: "1994-1",
            yearModelYear: "1994",
            yearModelFuelType: "1",
          }),
        ]),
      );
    });
  });
});
