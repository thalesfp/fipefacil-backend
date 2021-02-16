import * as UpdateFileStorage from "../../../src/storage/updateFile";
import * as Compress from "../../../src/utils/compress";

describe("storage", () => {
  describe("updates", () => {
    beforeAll(async () => {
      await UpdateFileStorage.createUpdateFilesBucket();
    });

    afterEach(async () => {
      await UpdateFileStorage.deleteUpdateFilesBucket();
    });

    it("should create and delete objects in the bucket", async () => {
      expect.assertions(2);

      const key = "my-test-key.zip";
      const compressedBody = Compress.stringToZip("hello world");

      await UpdateFileStorage.saveUpdateFile(key, compressedBody);

      const keysBeforeDelete = await UpdateFileStorage.listUpdateFiles();

      expect(keysBeforeDelete).toContain(key);

      await UpdateFileStorage.deleteUpdateFile(key);

      await new Promise((r) => setTimeout(r, 1000));

      const keysAfterDelete = await UpdateFileStorage.listUpdateFiles();

      expect(keysAfterDelete).toEqual([]);
    });
  });
});
