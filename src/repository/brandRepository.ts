import * as env from "env-var";
import { databaseManager, marshall, unmarshall } from "./databaseManager";
import VehicleType from "../types/VehicleType";
import { BrandDatabaseType, BrandUpdate } from "../types/DatabaseTypes";

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
    ExpressionAttributeValues: marshall({
      ":pk": vehicleTypeParam.toString(),
      ":sk": `BRAND#${id}`,
    }),
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
    ExpressionAttributeValues: marshall({
      ":pk": vehicleTypeParam.toString(),
      ":sk": `BRAND#`,
    }),
    ProjectionExpression: "sk, #nameAttr, vehicleType, popular",
    ExpressionAttributeNames: {
      "#nameAttr": "name",
    },
  };

  const { Items: response } = await databaseManager.query(params).promise();

  if (!response) return [];

  return response.map((brand) => unmarshall(brand) as BrandDatabaseType);
};

export const updateBrand = async (
  vehicleTypeParam: VehicleType,
  id: number,
  brand: BrandUpdate,
): Promise<BrandDatabaseType | null> => {
  const params = {
    TableName: PRICES_TABLE,
    Key: marshall({
      pk: vehicleTypeParam.toString(),
      sk: `BRAND#${id}`,
    }),
    UpdateExpression: "set #name = :name, popular = :popular",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: marshall({
      ":name": brand.name,
      ":popular": brand.popular,
    }),
    ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
    ReturnValues: "ALL_NEW",
  };

  try {
    const { Attributes: response } = await databaseManager
      .updateItem(params)
      .promise();

    if (!response) throw new Error("Item not found");

    return unmarshall(response) as BrandDatabaseType;
  } catch (error) {
    if (error.code === "ConditionalCheckFailedException") {
      throw new Error("Item not found");
    } else {
      throw error;
    }
  }
};
