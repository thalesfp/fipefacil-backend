import * as env from "env-var";
import { databaseManager, marshall, unmarshall } from "./databaseManager";
import { ModelDatabaseType } from "../types/DatabaseTypes";

const PRICES_TABLE = env.get("PRICES_TABLE").required().asString();

export const createModel = async ({
  id,
  name,
  brandId,
}: {
  id: number;
  name: string;
  brandId: number;
}): Promise<void> => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `BRAND#${brandId}`,
      sk: `MODEL#${id}`,
      name,
      createdAt: new Date().toISOString(),
    }),
  };

  await databaseManager.putItem(params).promise();
};

export const getModels = async (
  brandId: number,
): Promise<ModelDatabaseType[]> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with ( sk, :sk )",
    ExpressionAttributeValues: marshall({
      ":pk": `BRAND#${brandId}`,
      ":sk": "MODEL#",
    }),
    ProjectionExpression: "sk, #nameAttr",
    ExpressionAttributeNames: {
      "#nameAttr": "name",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!response) return [];

  return response.map((model) => unmarshall(model) as ModelDatabaseType);
};
