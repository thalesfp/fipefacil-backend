import {
  createPricesTable,
  dropPricesTable,
} from "../../../src/repository/databaseManager";
import createUpdateFiles from "../../../src/components/createUpdateFiles";
import {
  createUpdateFilesBucket,
  deleteUpdateFilesBucket,
  listUpdateFiles,
  deleteUpdateFile,
  getUpdateFile,
  saveUpdateFile,
} from "../../../src/storage/updateFileStorage";

import * as Compress from "../../../src/utils/compress";
import {
  createFixtures,
  expectedCarFileContent,
  expectedMotorcycleFileContent,
  expectedTruckFileContent,
} from "./createUpdateFiles.helper";

jest.mock("../../../src/storage/updateFileStorage", () => {
  const originalModule = jest.requireActual(
    "../../../src/storage/updateFileStorage",
  );

  return {
    ...originalModule,
    saveUpdateFile: jest.fn(originalModule.saveUpdateFile),
  };
});

describe("components", () => {
  beforeAll(async () => {
    await createUpdateFilesBucket();
    await createPricesTable();
  });

  afterAll(async () => {
    await dropPricesTable();
    await deleteUpdateFilesBucket();
  });

  describe("createUpdateFiles", () => {
    describe("#createUpdateFiles", () => {
      const carFileUpdate = "252-car.zip";
      const motorcycleFileUpdate = "252-motorcycle.zip";
      const truckFileUpdate = "252-truck.zip";

      beforeAll(async () => {
        await createFixtures();
        await createUpdateFiles();
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
        const carFile = Compress.zipToString(compressedCarFile);

        expect(JSON.parse(carFile)).toEqual(expectedCarFileContent);
      });

      it("should upload all motorcycle content correctly", async () => {
        expect.assertions(1);

        const compressedMotorcycleFile = await getUpdateFile(
          motorcycleFileUpdate,
        );
        const motorcycleFile = Compress.zipToString(compressedMotorcycleFile);

        expect(JSON.parse(motorcycleFile)).toEqual(
          expectedMotorcycleFileContent,
        );
      });

      it("should upload all truck content correctly", async () => {
        expect.assertions(1);

        const compressedTruckFile = await getUpdateFile(truckFileUpdate);
        const truckFile = Compress.zipToString(compressedTruckFile);

        expect(JSON.parse(truckFile)).toEqual(expectedTruckFileContent);
      });

      it("should not overwrite update files", async () => {
        expect.assertions(1);

        await createUpdateFiles();

        expect(saveUpdateFile).toBeCalledTimes(3);
      });
    });
  });
});
