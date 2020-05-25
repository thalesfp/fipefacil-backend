import { DynamoDB } from "aws-sdk";

export const databaseManager = new DynamoDB({
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  region: process.env.AWS_REGION,
});

export const createPricesTable = async (): Promise<void> => {
  const params = {
    TableName: process.env.PRICES_TABLE,
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
    TableName: process.env.PRICES_TABLE,
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
