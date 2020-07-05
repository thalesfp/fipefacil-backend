import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import { updateApp } from "../../../src/components/updateApp";
import {
  createUpdateBucket,
  deleteUpdateBucket,
  listUpdateFiles,
  deleteUpdateFile,
  getUpdateFile,
  saveUpdateFile,
} from "../../../src/storage/updates";

import { decompressZipToString } from "../../../src/utils/compress";
import {
  createFixtures,
  expectedCarFileContent,
  expectedMotorcycleFileContent,
  expectedTruckFileContent,
} from "./updateApp.helper";

jest.mock("../../../src/storage/updates", () => {
  const originalModule = jest.requireActual("../../../src/storage/updates");

  return {
    ...originalModule,
    saveUpdateFile: jest.fn(originalModule.saveUpdateFile),
  };
});

describe("components", () => {
  beforeAll(async () => {
    await createUpdateBucket();
    await createPricesTable();
  });

  afterAll(async () => {
    await dropPricesTable();
    await deleteUpdateBucket();
  });

  describe("updateApp", () => {
    describe("#updateApp", () => {
      const carFileUpdate = "car-2020-3.zip";
      const motorcycleFileUpdate = "motorcycle-2020-3.zip";
      const truckFileUpdate = "trucks-2020-3.zip";

      beforeAll(async () => {
        await createFixtures();
        await updateApp();
      });

      afterAll(async () => {
        const updateFiles = await listUpdateFiles();

        for (const updateFile of updateFiles) {
          await deleteUpdateFile(updateFile);
        }

        await new Promise((r) => setTimeout(r, 1000));
      });

      it("should upload compressed files to storage", async () => {
        expect.assertions(1);

        const updateFiles = await listUpdateFiles();

        expect(updateFiles).toEqual([
          carFileUpdate,
          motorcycleFileUpdate,
          truckFileUpdate,
        ]);
      });

      it("should upload all car content correctly", async () => {
        expect.assertions(1);

        const compressedCarFile = await getUpdateFile(carFileUpdate);
        const carFile = decompressZipToString(compressedCarFile);

        expect(JSON.parse(carFile)).toEqual(expectedCarFileContent);
      });

      it("should upload all motorcycle content correctly", async () => {
        expect.assertions(1);

        const compressedMotorcycleFile = await getUpdateFile(
          motorcycleFileUpdate,
        );
        const motorcycleFile = decompressZipToString(compressedMotorcycleFile);

        expect(JSON.parse(motorcycleFile)).toEqual(
          expectedMotorcycleFileContent,
        );
      });

      it("should upload all truck content correctly", async () => {
        expect.assertions(1);

        const compressedTruckFile = await getUpdateFile(truckFileUpdate);
        const truckFile = decompressZipToString(compressedTruckFile);

        expect(JSON.parse(truckFile)).toEqual(expectedTruckFileContent);
      });

      it("should not overwrite update files", async () => {
        expect.assertions(1);

        await updateApp();

        expect(saveUpdateFile).toBeCalledTimes(3);
      });
    });
  });
});
