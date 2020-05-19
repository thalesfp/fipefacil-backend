import { databaseManager, marshall, unmarshall } from "./databaseManager";
import vehicleTypeToString from "../transformers/vehicleTypeToString";
import VehicleType from "../types/VehicleType";

const { PRICES_TABLE } = process.env;

export const createBrand = async ({
  id,
  name,
  vehicleType,
  popular,
}: {
  id: number;
  name: string;
  vehicleType: VehicleType;
  popular: boolean;
}): Promise<void> => {
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

  await databaseManager.putItem(params).promise();
};

export const getBrand = async (
  vehicleTypeParam: VehicleType,
  id: number,
): Promise<Brand | null> => {
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

  return unmarshall(response[0]) as Brand;
};

export const getBrands = async (
  vehicleTypeParam: VehicleType,
): Promise<Brand[]> => {
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

  return response.map((brand) => unmarshall(brand) as Brand);
};
