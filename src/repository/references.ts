import { databaseManager, marshall, unmarshall } from "./databaseManager";

const { PRICES_TABLE } = process.env;

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
    ExpressionAttributeValues: {
      ":pk": {
        S: "REF",
      },
    },
    ScanIndexForward: false,
    Limit: 1,
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!Array.isArray(response) || response.length === 0) return null;

  const reference = unmarshall(response[0]) as ReferenceDatabaseType;

  return reference;
};
