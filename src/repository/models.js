const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { PRICES_TABLE } = process.env;

const createModel = async (id, name, brandId) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `BRAND#${brandId}`,
      sk: `MODEL#${id}`,
      name,
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getModels = async brandId => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with ( sk, :sk )",
    ExpressionAttributeValues: {
      ":pk": {
        S: `BRAND#${brandId}`,
      },
      ":sk": {
        S: "MODEL#",
      },
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (response.length === 0) return null;

  return response.map(model => unmarshall(model));
};

module.exports = {
  createModel,
  getModels,
};
