const { DynamoDB } = require("aws-sdk");

const { PRICES_TABLE, REFERENCES_TABLE } = process.env;

const databaseManager = new DynamoDB({
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  region: process.env.AWS_REGION,
});

const createPricesTable = async () => {
  const params = {
    TableName: PRICES_TABLE,
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

  return databaseManager.createTable(params).promise();
};

const dropPricesTable = async () => {
  const params = {
    TableName: PRICES_TABLE,
  };

  return databaseManager.deleteTable(params).promise();
};

const createReferencesTable = async () => {
  const params = {
    TableName: REFERENCES_TABLE,
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "N",
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

  return databaseManager.createTable(params).promise();
};

const dropReferencesTable = async () => {
  const params = {
    TableName: REFERENCES_TABLE,
  };

  return databaseManager.deleteTable(params).promise();
};

const marshall = object => DynamoDB.Converter.marshall(object);

const unmarshall = response => DynamoDB.Converter.unmarshall(response);

module.exports = {
  databaseManager,
  createPricesTable,
  dropPricesTable,
  createReferencesTable,
  dropReferencesTable,
  marshall,
  unmarshall,
};
