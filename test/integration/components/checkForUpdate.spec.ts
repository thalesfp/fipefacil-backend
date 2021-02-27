import * as env from "env-var";
import checkForUpdate from "../../../src/components/checkForUpdate";
import * as DatabaseManager from "../../../src/repository/databaseManager";
import * as QueueManager from "../../../src/queue/queueManager";
import * as ReferenceRepository from "../../../src/repository/referenceRepository";
import { ReferenciasResponseType } from "../../../src/types/FipeResponseTypes";

jest.mock("../../../src/services/fipeApi", () => ({
  getReferences: (): Promise<ReferenciasResponseType[]> =>
    Promise.resolve([
      { Codigo: 252, Mes: "março/2020 " },
      { Codigo: 251, Mes: "fevereiro/2020 " },
      { Codigo: 250, Mes: "janeiro/2020 " },
      { Codigo: 249, Mes: "dezembro/2019 " },
    ]),
}));

describe("checkForUpdate", () => {
  const queueUrl = env.get("REFERENCES_QUEUE").required().asString();

  beforeEach(async () => {
    await DatabaseManager.createPricesTable();
    await QueueManager.createQueue(queueUrl);
  });

  afterEach(async () => {
    await DatabaseManager.dropPricesTable();
    await QueueManager.deleteQueue(queueUrl);
  });

  describe("when database is empty", () => {
    it("should send last remote reference to queue", async () => {
      expect.assertions(1);

      await checkForUpdate();

      const messages = await QueueManager.receiveMessage(queueUrl);

      const expectedResponse = JSON.stringify({
        id: 252,
        month: 3,
        year: 2020,
      });

      expect(messages).toEqual([expectedResponse]);
    });
  });

  describe("when database is updated", () => {
    it("should not send last remote reference", async () => {
      expect.assertions(1);

      await ReferenceRepository.createReference({
        id: 252,
        month: 3,
        year: 2020,
      });

      await checkForUpdate();

      const messages = await QueueManager.receiveMessage(queueUrl);

      expect(messages.length).toEqual(0);
    });
  });

  describe("when database is outdated", () => {
    it("should send last remote reference to queue", async () => {
      expect.assertions(1);

      await ReferenceRepository.createReference({
        id: 251,
        month: 2,
        year: 2020,
      });
      await ReferenceRepository.createReference({
        id: 250,
        month: 1,
        year: 2020,
      });
      await ReferenceRepository.createReference({
        id: 249,
        month: 12,
        year: 2019,
      });

      await checkForUpdate();

      const messages = await QueueManager.receiveMessage(queueUrl);

      const expectedResponse = JSON.stringify({
        id: 252,
        month: 3,
        year: 2020,
      });

      expect(messages).toEqual([expectedResponse]);
    });
  });
});
