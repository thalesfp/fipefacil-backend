const { databaseManager, marshall, unmarshall } = require("./databaseManager");

const { PRICES_TABLE } = process.env;

const createBrand = async (id, name, vehicleType) => {
  const params = {
    TableName: PRICES_TABLE,
    Item: marshall({
      pk: vehicleType,
      sk: `BRAND#${id}`,
      name,
      createdAt: new Date().toISOString(),
    }),
  };

  return databaseManager.putItem(params).promise();
};

const getBrand = async (vehycleType, id) => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND sk = :sk",
    ExpressionAttributeValues: {
      ":pk": {
        S: vehycleType,
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

module.exports = {
  createBrand,
  getBrand,
};
