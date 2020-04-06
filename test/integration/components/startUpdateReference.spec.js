const {
  startUpdateReference,
} = require("../../../src/components/updater/startUpdateReference");
const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");
const { vehicleType } = require("../../../src/constants/vehicleType");

jest.mock("../../../src/api/fipeApi", () => ({
  getBrands: ({ params: { vehicleType: vehicleTypeParam } }) =>
    vehicleTypeParam === 1
      ? Promise.resolve([
          {
            Label: "Acura",
            Value: "1",
          },
          {
            Label: "Agrale",
            Value: "2",
          },
        ])
      : Promise.resolve([
          {
            Label: "ADLY",
            Value: "60",
          },
          {
            Label: "AGRALE",
            Value: "61",
          },
        ]),
}));

describe("startUpdateReference", () => {
  const queueUrl = process.env.BRANDS_QUEUE;

  beforeEach(async () => {
    await createQueue(queueUrl);
  });

  afterEach(async () => {
    await deleteQueue(queueUrl);
  });

  it("should send brands to queue", async () => {
    expect.assertions(2);

    const reference = { id: 252, month: 3, year: 2020 };

    await startUpdateReference({ reference });

    const { Messages: messages } = await receiveMessage(queueUrl, 4);

    const messagesJson = messages.map((message) => JSON.parse(message.Body));

    expect(messagesJson.length).toEqual(4);

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
      ]),
    );
  });
});
