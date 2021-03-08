import * as env from "env-var";
import { databaseManager, marshall, unmarshall } from "./databaseManager";
import FuelType from "../types/FuelType";
import { YearModelDatabaseType } from "../types/DatabaseTypes";

const PRICES_TABLE = env.get("PRICES_TABLE").required().asString();

export const createYearModel = async ({
  id,
  year,
  fuelType,
  modelId,
}: {
  id: string;
  year: number;
  fuelType: FuelType;
  modelId: number;
}): Promise<void> => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `MODEL#${modelId}`,
      sk: `YEAR_MODEL#${id}`,
      year,
      fuelType,
      currentPrice: null,
      createdAt: new Date().toISOString(),
      priceHistory: {},
    }),
    ConditionExpression: "attribute_not_exists(sk)",
  };

  try {
    await databaseManager.putItem(params).promise();
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      return;
    }

    throw error;
  }
};

export const updateYearModelCurrentPrice = async ({
  modelId,
  yearModelId,
  currentPrice,
  year,
  month,
}: {
  modelId: number;
  yearModelId: string;
  currentPrice: number;
  year: number;
  month: number;
}): Promise<YearModelDatabaseType> => {
  const params = {
    TableName: PRICES_TABLE,
    Key: marshall({
      pk: `MODEL#${modelId}`,
      sk: `YEAR_MODEL#${yearModelId}`,
    }),
    ReturnValues: "ALL_NEW",
    ExpressionAttributeNames: {
      "#yearMonth": `${year}-${month}`,
    },
    ExpressionAttributeValues: marshall({
      ":currentPrice": currentPrice,
    }),
    UpdateExpression:
      "SET currentPrice = :currentPrice, priceHistory.#yearMonth = :currentPrice",
  };

  const { Attributes: updatedAttributes } = await databaseManager
    .updateItem(params)
    .promise();

  if (!updatedAttributes) throw new Error("Year Model not found");

  return unmarshall(updatedAttributes) as YearModelDatabaseType;
};

export const getYearModels = async (
  modelId: number,
): Promise<
  Pick<
    YearModelDatabaseType,
    "year" | "fuelType" | "currentPrice" | "priceHistory"
  >[]
> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with ( sk, :sk )",
    ExpressionAttributeValues: marshall({
      ":pk": `MODEL#${modelId}`,
      ":sk": "YEAR_MODEL#",
    }),
    ProjectionExpression: "sk, #yearAttr, fuelType, currentPrice, priceHistory",
    ExpressionAttributeNames: {
      "#yearAttr": "year",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!response) return [];

  return response.map(
    (model) =>
      unmarshall(model) as Pick<
        YearModelDatabaseType,
        "year" | "fuelType" | "currentPrice" | "priceHistory"
      >,
  );
};
