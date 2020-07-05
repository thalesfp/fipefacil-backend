import {
  saveUpdateFile,
  deleteUpdateFile,
  listUpdateFiles,
  createUpdateFilesBucket,
  deleteUpdateFilesBucket,
} from "../../../src/storage/updateFiles";
import { compressStringToZip } from "../../../src/utils/compress";

describe("storage", () => {
  describe("updates", () => {
    beforeAll(async () => {
      await createUpdateFilesBucket();
    });

    afterEach(async () => {
      await deleteUpdateFilesBucket();
    });

    it("should create and delete objects in the bucket", async () => {
      expect.assertions(2);

      const key = "my-test-key.zip";
      const compressedBody = compressStringToZip("hello world");

      await saveUpdateFile(key, compressedBody);

      const keysBeforeDelete = await listUpdateFiles();

      expect(keysBeforeDelete).toContain(key);

      await deleteUpdateFile(key);

      await new Promise((r) => setTimeout(r, 1000));

      const keysAfterDelete = await listUpdateFiles();

      expect(keysAfterDelete).toEqual([]);
    });
  });
});
