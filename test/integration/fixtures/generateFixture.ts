import brandFixtures from "./brandFixtures";
import modelFixtures from "./modelFixtures";
import yearModelFixtures from "./yearModelFixtures";

import {
  normalizeBrands,
  normalizeModels,
  normalizeYearModels,
} from "../../../src/transformers/valuesFromRemoteApi";

// type FixtureResponseType =
//   | { id: number; name: string }[]
//   | { id: string; year: string; fuelType: string }[];

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
  count: number = 1,
): { id: number; name: string }[] =>
  generate(normalizeBrands(brandFixtures), count) as {
    id: number;
    name: string;
  }[];

export const generateModelFixture = (
  count: number = 1,
): { id: number; name: string }[] =>
  generate(normalizeModels(modelFixtures), count) as {
    id: number;
    name: string;
  }[];

export const generateYearModelFixture = (
  count: number = 1,
): { id: string; year: string; fuelType: string }[] =>
  generate(normalizeYearModels(yearModelFixtures), count) as {
    id: string;
    year: string;
    fuelType: string;
  }[];
