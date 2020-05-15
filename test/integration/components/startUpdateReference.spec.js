const {
  startUpdateReference,
} = require("../../../src/components/startUpdateReference");
const {
  createPricesTable,
  dropPricesTable,
} = require("../../../src/repository/databaseManager");
const { getCurrentReferenceId } = require("../../../src/repository/references");
const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");
const { vehicleType } = require("../../../src/constants/vehicleType");

jest.mock("../../../src/api/fipeApi", () => ({
  getBrands: ({ params: { vehicleType: vehicleTypeParam } }) => {
    switch (vehicleTypeParam) {
      case 1:
        return Promise.resolve([
          {
            Label: "Acura",
            Value: "1",
          },
          {
            Label: "Agrale",
            Value: "2",
          },
        ]);
      case 2:
        return Promise.resolve([
          {
            Label: "ADLY",
            Value: "60",
          },
          {
            Label: "AGRALE",
            Value: "61",
          },
        ]);
      case 3:
        return Promise.resolve([
          {
            Label: "BEPOBUS",
            Value: "206",
          },
          {
            Label: "CICCOBUS",
            Value: "121",
          },
        ]);
      default:
        throw new Error(`Invalid vehicleTypeParam: ${vehicleTypeParam}`);
    }
  },
}));

describe("startUpdateReference", () => {
  const queueUrl = process.env.BRANDS_QUEUE;

  beforeEach(async () => {
    await createPricesTable();
    await createQueue(queueUrl);
  });

  afterEach(async () => {
    await dropPricesTable();
    await deleteQueue(queueUrl);
  });

  it("should send brands to queue", async () => {
    expect.assertions(2);

    const reference = { id: 252, month: 3, year: 2020 };

    await startUpdateReference({ reference });

    const { Messages: messages } = await receiveMessage(queueUrl, 6);

    const messagesJson = messages.map((message) => JSON.parse(message.Body));

    expect(messagesJson.length).toEqual(6);

    expect(messagesJson).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          brandId: "1",
          brandName: "Acura",
          referenceId: 252,
          vehicleType: vehicleType.car,
        }),
        expect.objectContaining({
          brandId: "2",
          brandName: "Agrale",
          referenceId: 252,
          vehicleType: vehicleType.car,
        }),
        expect.objectContaining({
          brandId: "60",
          brandName: "ADLY",
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
        }),
        expect.objectContaining({
          brandId: "61",
          brandName: "AGRALE",
          referenceId: 252,
          vehicleType: vehicleType.motorcycle,
        }),
        expect.objectContaining({
          brandId: "206",
          brandName: "BEPOBUS",
          referenceId: 252,
          vehicleType: vehicleType.trucks,
        }),
        expect.objectContaining({
          brandId: "121",
          brandName: "CICCOBUS",
          referenceId: 252,
          vehicleType: vehicleType.trucks,
        }),
      ]),
    );
  });

  it("should update database with remote reference", async () => {
    expect.assertions(1);

    const reference = { id: 252, month: 3, year: 2020 };

    await startUpdateReference({ reference });

    const currentReferenceId = await getCurrentReferenceId();

    expect(currentReferenceId).toEqual(252);
  });
});
