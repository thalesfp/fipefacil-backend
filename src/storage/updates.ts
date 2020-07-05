import {
  createBucket,
  deleteBucket,
  putObject,
  deleteObject,
  listKeysInBucket,
  getObjectAsBuffer,
} from "./storageManager";

const { UPDATE_BUCKET_NAME, UPDATE_BUCKET_REGION } = process.env;

export const createUpdateBucket = async (): Promise<void> =>
  createBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);

export const deleteUpdateBucket = async (): Promise<void> =>
  deleteBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);

export const saveUpdateFile = async (
  key: string,
  body: Buffer,
): Promise<void> =>
  putObject(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME, key, body);

export const deleteUpdateFile = async (key: string): Promise<void> =>
  deleteObject(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME, key);

export const listUpdateFiles = async (): Promise<string[]> =>
  listKeysInBucket(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME);

export const getUpdateFile = async (key: string): Promise<Buffer> =>
  getObjectAsBuffer(UPDATE_BUCKET_REGION, UPDATE_BUCKET_NAME, key);
