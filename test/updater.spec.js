const checkForUpdate = require("../src/checkForUpdate");
const { getReferences } = require("../src/fipeApi");
const { getCurrentReferenceId } = require("../src/repository/references");
const { startUpdate } = require("../src/updater");

jest.mock("../src/fipeApi");
jest.mock("../src/repository/references");
jest.mock("../src/updater", () => ({
  startUpdate: jest.fn(),
}));

describe("references", () => {
  describe("checkForUpdate", () => {
    const serverResponse = [
      { Codigo: 251, Mes: "fevereiro/2020 " },
      { Codigo: 250, Mes: "janeiro/2020 " },
      { Codigo: 249, Mes: "dezembro/2019 " },
      { Codigo: 248, Mes: "novembro/2019 " },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should start update when current reference is null", async () => {
      getReferences.mockResolvedValue(serverResponse);
      getCurrentReferenceId.mockResolvedValue(null);

      await checkForUpdate();

      expect(startUpdate).toHaveBeenNthCalledWith(1, 251);
    });

    it("should not start update when current reference id is equal last server reference id", async () => {
      getReferences.mockResolvedValue(serverResponse);
      getCurrentReferenceId.mockResolvedValue(251);

      await checkForUpdate();

      expect(startUpdate).not.toHaveBeenCalled();
    });

    it("should start update when current reference id is less than last server reference", async () => {
      getReferences.mockResolvedValue(serverResponse);
      getCurrentReferenceId.mockResolvedValue(250);

      await checkForUpdate();

      expect(startUpdate).toHaveBeenNthCalledWith(1, 251);
    });
  });
});
