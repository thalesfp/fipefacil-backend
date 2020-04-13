const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { PRICES_TABLE } = process.env;

const createYearModel = async ({ id, year, fuelType, modelId }) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: `MODEL#${modelId}`,
      sk: `YEAR_MODEL#${id}`,
      year,
      fuelType,
      currentPrice: null,
      createdAt: new Date().toISOString(),
      priceHistory: {},
    }),
  };

  return databaseManager.putItem(params).promise();
};

const updateYearModelCurrentPrice = async ({
  modelId,
  yearModelId,
  currentPrice,
  year,
  month,
}) => {
  const params = {
    TableName: PRICES_TABLE,
    Key: {
      pk: {
        S: `MODEL#${modelId}`,
      },
      sk: {
        S: `YEAR_MODEL#${yearModelId}`,
      },
    },
    ReturnValues: "ALL_NEW",
    ExpressionAttributeNames: {
      "#yearMonth": `${year}-${month}`,
    },
    ExpressionAttributeValues: {
      ":currentPrice": {
        N: String(currentPrice),
      },
    },
    UpdateExpression:
      "SET currentPrice = :currentPrice, priceHistory.#yearMonth = :currentPrice",
  };

  const { Attributes: updatedAttributes } = await databaseManager
    .updateItem(params)
    .promise();

  return unmarshall(updatedAttributes);
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
    ProjectionExpression: "#yearAttr, fuelType, currentPrice, priceHistory",
    ExpressionAttributeNames: {
      "#yearAttr": "year",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  return response.map((model) => unmarshall(model));
};

module.exports = {
  createYearModel,
  getYearModels,
  updateYearModelCurrentPrice,
};
