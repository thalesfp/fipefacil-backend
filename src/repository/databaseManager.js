const AWS = require("aws-sdk");

const { TABLE_NAME } = process.env;

const databaseManager = new AWS.DynamoDB({
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  region: process.env.AWS_REGION,
});

const createTable = async () => {
  const params = {
    TableName: TABLE_NAME,
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

const dropTable = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  return databaseManager.deleteTable(params).promise();
};

const marshall = object => AWS.DynamoDB.Converter.marshall(object);

const unmarshall = response => AWS.DynamoDB.Converter.unmarshall(response);

module.exports = {
  databaseManager,
  createTable,
  dropTable,
  marshall,
  unmarshall,
};
