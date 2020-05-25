import brandFixtures from "./brandFixtures";
import modelFixtures from "./modelFixtures";
import yearModelFixtures from "./yearModelFixtures";

import {
  normalizeBrands,
  normalizeModels,
  normalizeYearModels,
} from "../../../src/transformers/valuesFromRemoteApi";
import { FuelType } from "../../../src/types/FuelType";

const generate = <T extends { id: string | number }>(
  arrayOfFixtures: T[],
  count: number,
): T[] => {
  const response = [];

  do {
    const newFixture =
      arrayOfFixtures[Math.floor(Math.random() * arrayOfFixtures.length)];

    if (!newFixture.id) throw new Error("Invalid fixture");

    if (!response.map((item) => item.id).includes(newFixture.id)) {
      response.push(newFixture);
    }
  } while (response.length < count);

  return response;
};

export const generateBrandFixture = (
  count = 1,
): { id: number; name: string }[] =>
  generate(normalizeBrands(brandFixtures), count) as {
    id: number;
    name: string;
  }[];

export const generateModelFixture = (
  count = 1,
): { id: number; name: string }[] =>
  generate(normalizeModels(modelFixtures), count) as {
    id: number;
    name: string;
  }[];

export const generateYearModelFixture = (
  count = 1,
): { id: string; year: number; fuelType: FuelType }[] =>
  generate(normalizeYearModels(yearModelFixtures), count) as {
    id: string;
    year: number;
    fuelType: FuelType;
  }[];
