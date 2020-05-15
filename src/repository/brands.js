const { databaseManager, marshall, unmarshall } = require("./databaseManager");
const { vehicleTypeToString } = require("../constants/vehicleType");

const { PRICES_TABLE } = process.env;

const createBrand = async ({ id, name, vehicleType, popular }) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: vehicleTypeToString(vehicleType),
      sk: `BRAND#${id}`,
      name,
      popular,
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getBrand = async (vehicleTypeParam, id) => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND sk = :sk",
    ExpressionAttributeValues: {
      ":pk": {
        S: vehicleTypeToString(vehicleTypeParam),
      },
      ":sk": {
        S: `BRAND#${id}`,
      },
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (response.length === 0) return null;

  return response.map((brand) => unmarshall(brand));
};

const getBrands = async (vehicleTypeParam) => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": {
        S: vehicleTypeToString(vehicleTypeParam),
      },
      ":sk": {
        S: `BRAND#`,
      },
    },
    ProjectionExpression: "sk, #nameAttr, popular",
    ExpressionAttributeNames: {
      "#nameAttr": "name",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  return response.map((brand) => unmarshall(brand));
};

module.exports = {
  createBrand,
  getBrand,
  getBrands,
};
