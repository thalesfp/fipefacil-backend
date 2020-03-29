const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { PRICES_TABLE } = process.env;

const createYearModel = async (id, year, fuelType, modelId) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `MODEL#${modelId}`,
      sk: `YEAR_MODEL#${id}`,
      year,
      fuelType,
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getYearModels = async (modelId) => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with ( sk, :sk )",
    ExpressionAttributeValues: {
      ":pk": {
        S: `MODEL#${modelId}`,
      },
      ":sk": {
        S: "YEAR_MODEL#",
      },
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (response.length === 0) return null;

  return response.map((model) => unmarshall(model));
};

module.exports = {
  createYearModel,
  getYearModels,
};
