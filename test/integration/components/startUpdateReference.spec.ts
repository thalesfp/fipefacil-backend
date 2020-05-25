import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import {
  createQueue,
  deleteQueue,
  receiveMessage,
} from "../../../src/queue/queueManager";
import startUpdateReference from "../../../src/components/startUpdateReference";
import { getCurrentReferenceId } from "../../../src/repository/references";
import VehicleType from "../../../src/types/VehicleType";
import { PriceReferenceType } from "../../../src/types/Types";

jest.mock("../../../src/api/fipeApi", () => ({
  getBrands: ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    referenceId,
    vehicleType,
  }: {
    referenceId: number;
    vehicleType: VehicleType;
  }): Promise<MarcasResponseType[]> => {
    switch (vehicleType) {
      case VehicleType.car:
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
      case VehicleType.motorcycle:
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
      case VehicleType.trucks:
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
        throw new Error(`Invalid vehicleTypeParam: ${vehicleType}`);
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

    await startUpdateReference(reference);

    const messages = await receiveMessage(queueUrl, 6);

    const messagesJson: PriceReferenceType[] = messages.map((message: string) =>
      JSON.parse(message),
    );

    expect(messagesJson.length).toEqual(6);

    expect(messagesJson).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          brandId: 1,
          brandName: "Acura",
          referenceId: 252,
          vehicleType: VehicleType.car,
        }),
        expect.objectContaining({
          brandId: 2,
          brandName: "Agrale",
          referenceId: 252,
          vehicleType: VehicleType.car,
        }),
        expect.objectContaining({
          brandId: 60,
          brandName: "ADLY",
          referenceId: 252,
          vehicleType: VehicleType.motorcycle,
        }),
        expect.objectContaining({
          brandId: 61,
          brandName: "AGRALE",
          referenceId: 252,
          vehicleType: VehicleType.motorcycle,
        }),
        expect.objectContaining({
          brandId: 206,
          brandName: "BEPOBUS",
          referenceId: 252,
          vehicleType: VehicleType.trucks,
        }),
        expect.objectContaining({
          brandId: 121,
          brandName: "CICCOBUS",
          referenceId: 252,
          vehicleType: VehicleType.trucks,
        }),
      ]),
    );
  });

  it("should update database with remote reference", async () => {
    expect.assertions(1);

    const reference = { id: 252, month: 3, year: 2020 };

    await startUpdateReference(reference);

    const currentReferenceId = await getCurrentReferenceId();

    expect(currentReferenceId).toEqual(252);
  });
});
