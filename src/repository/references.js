const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { TABLE_NAME } = process.env;

const createReference = async (id, month, year) => {
  const params = {
    TableName: TABLE_NAME,
    Item: marshall({
      pk: "REF",
      sk: String(id),
      month: String(month),
      year: String(year),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getCurrentReferenceId = async () => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "pk = :value",
    ExpressionAttributeValues: {
      ":value": {
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
