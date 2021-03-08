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
      pk: "REF",
      sk: String(id),
      month: month,
      year: year,
      createdAt: new Date().toISOString(),
    }),
  };

  await databaseManager.putItem(params).promise();
};

export const getCurrentReference = async (): Promise<ReferenceDatabaseType | null> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: marshall({
      ":pk": "REF",
    }),
    ScanIndexForward: false,
    Limit: 1,
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!Array.isArray(response) || response.length === 0) return null;

  const reference = unmarshall(response[0]) as ReferenceDatabaseType;

  return reference;
};

export const getAllReferences = async (): Promise<ReferenceDatabaseType[]> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: marshall({
      ":pk": "REF",
    }),
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!Array.isArray(response) || response.length === 0) return [];

  const references = response.map(
    (reference) => unmarshall(reference) as ReferenceDatabaseType,
  );

  return references;
};
