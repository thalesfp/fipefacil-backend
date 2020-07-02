import { numberToFuelType } from "./numberToFuelType";
import {
  PriceReferenceType,
  BrandType,
  ModelType,
  YearModelType,
} from "../types/Types";

import {
  ReferenciasResponseType,
  MarcasResponseType,
  ModelosResponseType,
  AnoModelosResponseType,
} from "../types/FipeResponseTypes";

enum months {
  janeiro = 1,
  fevereiro = 2,
  março = 3,
  abril = 4,
  maio = 5,
  junho = 6,
  julho = 7,
  agosto = 8,
  setembro = 9,
  outubro = 10,
  novembro = 11,
  dezembro = 12,
}

export const extractDateFromRemoteReference = (
  date: string,
): { month: number; year: number } => {
  const [month, year] = date.trim().split("/");

  return { month: Object(months)[month], year: parseInt(year, 10) };
};

export const normalizeReferences = (
  references: ReferenciasResponseType[],
): PriceReferenceType[] =>
  references.map((reference) => ({
    id: reference.Codigo,
    ...extractDateFromRemoteReference(reference.Mes),
  }));

export const normalizeBrands = (brands: MarcasResponseType[]): BrandType[] =>
  brands.map((brand) => ({ id: parseInt(brand.Value, 10), name: brand.Label }));

export const normalizeModels = (models: ModelosResponseType[]): ModelType[] =>
  models.map((model) => ({ id: model.Value, name: model.Label }));

export const normalizeYearModels = (
  yearModels: AnoModelosResponseType[],
): YearModelType[] =>
  yearModels.map((yearModel) => {
    const [year, fuelType] = yearModel.Value.split("-");

    return {
      id: yearModel.Value,
      year: parseInt(year, 10),
      fuelType: numberToFuelType(parseInt(fuelType, 10)),
    };
  });

export const normalizePrice = (price: string): number => {
  const normalizedPrice = price.replace(/[^0-9,]/g, "").replace(/,/, ".");

  return parseFloat(normalizedPrice);
};

export const normalizeDateReferenceFromPrice = (
  mesReferencia: string,
): { month: number; year: number } => {
  const [month, year] = mesReferencia.trim().split(" de ");

  return {
    month: Object(months)[month],
    year: parseInt(year, 10),
  };
};

export const normalizeYearModel = (yearModel: {
  Valor: string;
  MesReferencia: string;
}): { value: number; reference: { month: number; year: number } } => ({
  value: normalizePrice(yearModel.Valor),
  reference: normalizeDateReferenceFromPrice(yearModel.MesReferencia),
});
