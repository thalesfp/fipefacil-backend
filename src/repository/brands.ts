import * as env from "env-var";
import { databaseManager, marshall, unmarshall } from "./databaseManager";
import VehicleType from "../types/VehicleType";
import { BrandDatabaseType } from "../types/DatabaseTypes";

const PRICES_TABLE = env.get("PRICES_TABLE").required().asString();

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
  await databaseManager
    .putItem({
      TableName: PRICES_TABLE,
      Item: marshall({
        pk: `BRAND#${id}`,
        sk: vehicleType.toString(),
        name,
        vehicleType,
        popular,
        createdAt: new Date().toISOString(),
      }),
    })
    .promise();
};

export const getBrand = async (
  vehicleTypeParam: VehicleType,
  id: number,
): Promise<BrandDatabaseType | null> => {
  const { Items: response } = await databaseManager
    .query({
      TableName: PRICES_TABLE,
      KeyConditionExpression: "pk = :pk AND sk = :sk",
      ExpressionAttributeValues: marshall({
        ":sk": vehicleTypeParam.toString(),
        ":pk": `BRAND#${id}`,
      }),
    })
    .promise();

  if (!response || response.length === 0) return null;

  return unmarshall(response[0]) as BrandDatabaseType;
};

export const getBrands = async (
  vehicleTypeParam: VehicleType,
): Promise<BrandDatabaseType[]> => {
  const { Items: response } = await databaseManager
    .scan({
      TableName: PRICES_TABLE,
      FilterExpression: "sk = :sk AND begins_with(pk, :pk)",
      ExpressionAttributeValues: marshall({
        ":sk": vehicleTypeParam.toString(),
        ":pk": "BRAND#",
      }),
      ProjectionExpression: "pk, #nameAttr, vehicleType, popular",
      ExpressionAttributeNames: {
        "#nameAttr": "name",
      },
    })
    .promise();

  if (!response) return [];

  return response.map((brand) => unmarshall(brand) as BrandDatabaseType);
};
