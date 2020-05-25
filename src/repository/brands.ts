import { databaseManager, marshall, unmarshall } from "./databaseManager";
import { VehicleType } from "../types/VehicleType";

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
      pk: vehicleType.toString(),
      sk: `BRAND#${id}`,
      name,
      vehicleType,
      popular,
      createdAt: new Date().toISOString(),
    }),
  };

  await databaseManager.putItem(params).promise();
};

export const getBrand = async (
  vehicleTypeParam: VehicleType,
  id: number,
): Promise<BrandDatabaseType | null> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND sk = :sk",
    ExpressionAttributeValues: {
      ":pk": {
        S: vehicleTypeParam.toString(),
      },
      ":sk": {
        S: `BRAND#${id}`,
      },
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!response || response.length === 0) return null;

  return unmarshall(response[0]) as BrandDatabaseType;
};

export const getBrands = async (
  vehicleTypeParam: VehicleType,
): Promise<BrandDatabaseType[]> => {
  const params = {
    TableName: PRICES_TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": {
        S: vehicleTypeParam.toString(),
      },
      ":sk": {
        S: `BRAND#`,
      },
    },
    ProjectionExpression: "sk, #nameAttr, vehicleType, popular",
    ExpressionAttributeNames: {
      "#nameAttr": "name",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!response) return [];

  return response.map((brand) => unmarshall(brand) as BrandDatabaseType);
};
