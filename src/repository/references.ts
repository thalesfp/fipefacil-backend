import * as env from "env-var";
import { databaseManager, marshall, unmarshall } from "./databaseManager";
import { ReferenceDatabaseType } from "../types/DatabaseTypes";

const PRICES_TABLE = env.get("PRICES_TABLE").required().asString();

export const createReference = async ({
  id,
  month,
  year,
}: {
  id: number;
  month: number;
  year: number;
}): Promise<void> => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: String(id),
      sk: "REF",
      month: month,
      year: year,
      createdAt: new Date().toISOString(),
    }),
  };

  await databaseManager.putItem(params).promise();
};

export const getCurrentReference = async (): Promise<ReferenceDatabaseType | null> => {
  const { Items: response } = await databaseManager
    .scan({
      TableName: PRICES_TABLE,
      FilterExpression: "sk = :ref_string",
      ExpressionAttributeValues: marshall({ ":ref_string": "REF" }),
    })
    .promise();

  if (!Array.isArray(response) || response.length === 0) return null;

  const references: ReferenceDatabaseType[] = response.map(
    (item) => unmarshall(item) as ReferenceDatabaseType,
  );

  const lastReference = references.reduce(function (
    previousValue,
    currentValue,
  ) {
    return previousValue.pk > currentValue.pk ? previousValue : currentValue;
  });

  return lastReference;
};
