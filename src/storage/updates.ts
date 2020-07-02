import {
  createBucket,
  deleteBucket,
  putObject,
  deleteObject,
  listKeysInBucket,
} from "./storageManager";

const { UPDATE_BUCKET_NAME, UPDATE_BUCKET_REGION } = process.env;

export const createUpdateBucket = async (): Promise<void> => {
  await createBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);
};

export const deleteUpdateBucket = async (): Promise<void> => {
  await deleteBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);
};

export const saveUpdateFile = async (
  key: string,
  body: Buffer,
): Promise<void> => {
  await putObject(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME, key, body);
};

export const deleteUpdateFile = async (key: string): Promise<void> => {
  await deleteObject(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME, key);
};

export const listUpdateFiles = async (): Promise<string[]> => {
  return listKeysInBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);
};
