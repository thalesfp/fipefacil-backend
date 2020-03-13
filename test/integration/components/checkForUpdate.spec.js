const checkForUpdate = require("../../../src/components/checkForUpdate");

const {
  createTable,
  dropTable,
} = require("../../../src/repository/databaseManager");

const { createReference } = require("../../../src/repository/references");

const {
  createQueue,
  deleteQueue,
  receiveMessage,
} = require("../../../src/queue/queueManager");

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

      const expectedResponse = { referenceId: 252, month: 3, year: 2020 };

      expect(message.Messages[0].Body).toEqual(
        JSON.stringify(expectedResponse),
      );
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

      const expectedResponse = { referenceId: 252, month: 3, year: 2020 };

      expect(message.Messages[0].Body).toEqual(
        JSON.stringify(expectedResponse),
      );
    });
  });
});
