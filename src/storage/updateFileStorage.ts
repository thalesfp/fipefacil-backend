import * as env from "env-var";
import {
  createBucket,
  deleteBucket,
  putObject,
  deleteObject,
  listKeysInBucket,
  getObjectAsBuffer,
} from "./storageManager";

const UPDATE_FILES_BUCKET_NAME = env
  .get("UPDATE_FILES_BUCKET_NAME")
  .required()
  .asString();
const UPDATE_FILES_BUCKET_REGION = env
  .get("UPDATE_FILES_BUCKET_REGION")
  .required()
  .asString();

export const createUpdateFilesBucket = async (): Promise<void> =>
  createBucket(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME);

export const deleteUpdateFilesBucket = async (): Promise<void> =>
  deleteBucket(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME);

export const saveUpdateFile = async (
  key: string,
  body: Buffer,
): Promise<void> =>
  putObject(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME, key, body);

export const deleteUpdateFile = async (key: string): Promise<void> =>
  deleteObject(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME, key);

export const listUpdateFiles = async (): Promise<string[]> =>
  listKeysInBucket(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME);

export const getUpdateFile = async (key: string): Promise<Buffer> =>
  getObjectAsBuffer(UPDATE_FILES_BUCKET_REGION, UPDATE_FILES_BUCKET_NAME, key);
