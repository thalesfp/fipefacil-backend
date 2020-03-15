const { checkForUpdate } = require("../../../src/components/checkForUpdate");
const {
  createTable,
  dropTable,
} = require("../../../src/repository/databaseManager");
const {
  createReference,
  getCurrentReferenceId,
} = require("../../../src/repository/references");
const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");
const referencesQueue = require("../../../src/queue/referencesQueue");

jest.mock("../../../src/queue/referencesQueue", () => {
  const actualModule = jest.requireActual("../../../src/queue/referencesQueue");

  return {
    ...actualModule,
    sendMessage: jest.fn().mockImplementation(actualModule.sendMessage),
  };
});

jest.mock("../../../src/fipeApi.js", () => ({
  getReferences: () =>
    Promise.resolve([
      { Codigo: 252, Mes: "março/2020 " },
      { Codigo: 251, Mes: "fevereiro/2020 " },
      { Codigo: 250, Mes: "janeiro/2020 " },
      { Codigo: 249, Mes: "dezembro/2019 " },
    ]),
}));

describe("checkForUpdate", () => {
  const queueUrl = process.env.REFERENCES_QUEUE;

  beforeEach(async () => {
    await createTable();
    await createQueue(queueUrl);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await dropTable();
    await deleteQueue(queueUrl);
  });

  describe("when database is empty", () => {
    it("should send last remote reference to queue", async () => {
      expect.assertions(1);

      await checkForUpdate();

      const message = await receiveMessage(queueUrl);

      const expectedResponse = JSON.stringify({
        id: 252,
        month: 3,
        year: 2020,
      });

      expect(message.Messages[0].Body).toEqual(expectedResponse);
    });

    it("should update database with remote reference", async () => {
      expect.assertions(1);

      await checkForUpdate();

      const currentReferenceId = await getCurrentReferenceId();

      expect(currentReferenceId).toEqual(252);
    });

    it("should not update database when queue fails", async () => {
      expect.assertions(3);

      const referencesQueueSpy = jest
        .spyOn(referencesQueue, "sendMessage")
        .mockRejectedValueOnce(new Error("Queue Error"));

      await createReference(251, 2, 2020);
      await createReference(250, 1, 2020);
      await createReference(249, 12, 2019);

      await expect(checkForUpdate()).rejects.toThrow(Error);
      expect(referencesQueueSpy).toBeCalledTimes(1);

      const currentReferenceId = await getCurrentReferenceId();
      expect(currentReferenceId).toEqual(251);
    });
  });

  describe("when database is updated", () => {
    it("should not send last remote reference", async () => {
      expect.assertions(1);

      await createReference(252, 3, 2020);

      await checkForUpdate();

      const message = await receiveMessage(queueUrl);

      expect(message.Messages).toBeUndefined();
    });
  });

  describe("when database is outdated", () => {
    it("should send last remote reference to queue", async () => {
      expect.assertions(1);

      await createReference(251, 2, 2020);
      await createReference(250, 1, 2020);
      await createReference(249, 12, 2019);

      await checkForUpdate();

      const message = await receiveMessage(queueUrl);

      const expectedResponse = JSON.stringify({
        id: 252,
        month: 3,
        year: 2020,
      });

      expect(message.Messages[0].Body).toEqual(expectedResponse);
    });

    it("should update database with remote reference", async () => {
      expect.assertions(1);

      await createReference(251, 2, 2020);
      await createReference(250, 1, 2020);
      await createReference(249, 12, 2019);

      await checkForUpdate();

      const currentReferenceId = await getCurrentReferenceId();

      expect(currentReferenceId).toEqual(252);
    });
  });
});
