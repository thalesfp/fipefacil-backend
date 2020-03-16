const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { REFERENCES_TABLE } = process.env;

const createReference = async (id, month, year) => {
  const params = {
    TableName: REFERENCES_TABLE,
    Item: marshall({
      pk: "REF",
      sk: parseInt(id, 10),
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getCurrentReferenceId = async () => {
  const params = {
    TableName: REFERENCES_TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": {
        S: "REF",
      },
    },
    ProjectionExpression: "sk",
    ScanIndexForward: false,
    Limit: "1",
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (response.length === 0) return null;

  const { sk: referenceId } = unmarshall(response[0]);

  return parseInt(referenceId, 10);
};

module.exports = {
  createReference,
  getCurrentReferenceId,
};
