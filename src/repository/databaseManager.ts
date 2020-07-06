import { DynamoDB } from "aws-sdk";
import * as env from "env-var";

export const databaseManager = new DynamoDB({
  endpoint: env.get("AWS_DYNAMODB_ENDPOINT").asString(),
  region: env.get("AWS_REGION").asString(),
});

export const createPricesTable = async (): Promise<void> => {
  const params = {
    TableName: env.get("PRICES_TABLE").required().asString(),
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  await databaseManager.createTable(params).promise();
};

export const dropPricesTable = async (): Promise<void> => {
  const params = {
    TableName: env.get("PRICES_TABLE").required().asString(),
  };

  await databaseManager.deleteTable(params).promise();
};

export const marshall = (object: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}): DynamoDB.AttributeMap => DynamoDB.Converter.marshall(object);

export const unmarshall = (
  response: DynamoDB.AttributeMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [key: string]: any } => DynamoDB.Converter.unmarshall(response);
