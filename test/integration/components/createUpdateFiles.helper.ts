import { createBrand } from "../../../src/repository/brand";
import { createModel } from "../../../src/repository/model";
import { createYearModel } from "../../../src/repository/yearModel";
import { createReference } from "../../../src/repository/reference";
import {
  generateBrandFixture,
  generateModelFixture,
  generateYearModelFixture,
} from "../fixtures/generateFixture";
import VehicleType from "../../../src/types/VehicleType";

const [brand1, brand2, brand3, brand4] = generateBrandFixture(4);
const [model1, model2, model3, model4] = generateModelFixture(4);

const [
  yearModel1,
  yearModel2,
  yearModel3,
  yearModel4,
  yearModel5,
] = generateYearModelFixture(5);

export const createFixtures = async (): Promise<void> => {
  await createReference({ id: 252, month: 3, year: 2020 });

  // car -> brands
  await createBrand({
    id: brand1.id,
    name: brand1.name,
    vehicleType: VehicleType.car,
    popular: false,
  });
  await createBrand({
    id: brand2.id,
    name: brand2.name,
    vehicleType: VehicleType.car,
    popular: false,
  });

  // motorcycle -> brands
  await createBrand({
    id: brand3.id,
    name: brand3.name,
    vehicleType: VehicleType.motorcycle,
    popular: true,
  });

  // truck -> brands
  await createBrand({
    id: brand4.id,
    name: brand4.name,
    vehicleType: VehicleType.truck,
    popular: false,
  });

  // cars -> brand1 -> models
  await createModel({
    id: model1.id,
    name: model1.name,
    brandId: brand1.id,
  });
  await createModel({
    id: model2.id,
    name: model2.name,
    brandId: brand1.id,
  });

  // cars -> brand3 -> models
  await createModel({
    id: model3.id,
    name: model3.name,
    brandId: brand3.id,
  });

  // motorcyle -> brand4 -> models
  await createModel({
    id: model4.id,
    name: model4.name,
    brandId: brand4.id,
  });

  // brand1 -> model1 -> yearModels
  await createYearModel({
    id: yearModel1.id,
    year: yearModel1.year,
    fuelType: yearModel1.fuelType,
    modelId: model1.id,
  });
  await createYearModel({
    id: yearModel2.id,
    year: yearModel2.year,
    fuelType: yearModel2.fuelType,
    modelId: model1.id,
  });
  await createYearModel({
    id: yearModel3.id,
    year: yearModel3.year,
    fuelType: yearModel3.fuelType,
    modelId: model1.id,
  });

  // brand3 -> model3 -> yearModels
  await createYearModel({
    id: yearModel4.id,
    year: yearModel4.year,
    fuelType: yearModel4.fuelType,
    modelId: model3.id,
  });

  // brand4 -> model4 -> yearModels
  await createYearModel({
    id: yearModel5.id,
    year: yearModel5.year,
    fuelType: yearModel5.fuelType,
    modelId: model4.id,
  });
};

export const expectedCarFileContent = expect.arrayContaining([
  {
    sk: `BRAND#${brand1.id}`,
    name: brand1.name,
    popular: false,
    vehicleType: VehicleType.car,
    models: expect.arrayContaining([
      {
        sk: `MODEL#${model1.id}`,
        name: model1.name,
        yearModels: expect.arrayContaining([
          {
            sk: `YEAR_MODEL#${yearModel3.id}`,
            year: yearModel3.year,
            fuelType: 1,
            currentPrice: null,
            priceHistory: {},
          },
          {
            sk: `YEAR_MODEL#${yearModel2.id}`,
            year: yearModel2.year,
            fuelType: 1,
            currentPrice: null,
            priceHistory: {},
          },
          {
            sk: `YEAR_MODEL#${yearModel1.id}`,
            year: yearModel1.year,
            fuelType: 1,
            currentPrice: null,
            priceHistory: {},
          },
        ]),
      },
      {
        sk: `MODEL#${model2.id}`,
        name: model2.name,
        yearModels: [],
      },
    ]),
  },
  {
    sk: `BRAND#${brand2.id}`,
    name: brand2.name,
    popular: false,
    vehicleType: VehicleType.car,
    models: [],
  },
]);

export const expectedMotorcycleFileContent = expect.arrayContaining([
  {
    sk: `BRAND#${brand3.id}`,
    name: brand3.name,
    popular: true,
    vehicleType: VehicleType.motorcycle,
    models: expect.arrayContaining([
      {
        sk: `MODEL#${model3.id}`,
        name: model3.name,
        yearModels: [
          {
            sk: `YEAR_MODEL#${yearModel4.id}`,
            fuelType: yearModel4.fuelType,
            year: yearModel4.year,
            priceHistory: {},
            currentPrice: null,
          },
        ],
      },
    ]),
  },
]);

export const expectedTruckFileContent = expect.arrayContaining([
  {
    sk: `BRAND#${brand4.id}`,
    name: brand4.name,
    popular: false,
    vehicleType: VehicleType.truck,
    models: expect.arrayContaining([
      {
        sk: `MODEL#${model4.id}`,
        name: model4.name,
        yearModels: [
          {
            sk: `YEAR_MODEL#${yearModel5.id}`,
            fuelType: yearModel5.fuelType,
            year: yearModel5.year,
            priceHistory: {},
            currentPrice: null,
          },
        ],
      },
    ]),
  },
]);
