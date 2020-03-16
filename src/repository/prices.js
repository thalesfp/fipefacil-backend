const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { PRICES_TABLE } = process.env;

const createPrice = async (modelId, yearModelId, referenceId, value) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `MODEL#${modelId}_YEAR_MODEL#${yearModelId}`,
      sk: `REF#${referenceId}`,
      value,
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getPrices = async (modelId, yearModelId) => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with ( sk, :sk )",
    ExpressionAttributeValues: {
      ":pk": {
        S: `MODEL#${modelId}_YEAR_MODEL#${yearModelId}`,
      },
      ":sk": {
        S: "REF#",
      },
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (response.length === 0) return null;

  return response.map(model => unmarshall(model));
};

module.exports = {
  createPrice,
  getPrices,
};
