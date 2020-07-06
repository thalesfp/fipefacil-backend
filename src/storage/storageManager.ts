import { S3 } from "aws-sdk";
import { Readable } from "stream";
import * as env from "env-var";

export const storageManager = (region: string): S3 => {
  const AWS_S3_ENDPOINT = env.get("AWS_S3_ENDPOINT").asString();

  if (AWS_S3_ENDPOINT) {
    const AWS_ACCESS_KEY_ID = env
      .get("AWS_ACCESS_KEY_ID")
      .required()
      .asString();
    const AWS_SECRET_ACCESS_KEY = env
      .get("AWS_SECRET_ACCESS_KEY")
      .required()
      .asString();

    return new S3({
      region,
      endpoint: AWS_S3_ENDPOINT,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      s3ForcePathStyle: true,
    });
  }

  return new S3({ region });
};

export const createBucket = async (
  region: string,
  bucketName: string,
): Promise<void> => {
  const client = storageManager(region);

  await client
    .createBucket({
      Bucket: bucketName,
    })
    .promise();
};

export const deleteBucket = async (
  region: string,
  bucketName: string,
): Promise<void> => {
  const client = storageManager(region);

  await client
    .deleteBucket({
      Bucket: bucketName,
    })
    .promise();
};

export const putObject = async (
  region: string,
  bucketName: string,
  key: string,
  body: Buffer | Uint8Array | Blob | string | Readable,
): Promise<void> => {
  const client = storageManager(region);

  await client
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: body,
    })
    .promise();
};

export const deleteObject = async (
  region: string,
  bucketName: string,
  key: string,
): Promise<void> => {
  const client = storageManager(region);

  client
    .deleteObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};

export const getObjectAsBuffer = async (
  region: string,
  bucketName: string,
  key: string,
): Promise<Buffer> => {
  const client = storageManager(region);

  const object = await client
    .getObject({
      Bucket: bucketName,
      Key: key,
    })
    .promise();

  return object.Body as Buffer;
};

export const listKeysInBucket = async (
  region: string,
  bucketName: string,
): Promise<string[]> => {
  const client = storageManager(region);

  const objects = await client.listObjectsV2({ Bucket: bucketName }).promise();

  const keys = objects.Contents?.map((content) => content.Key ?? "") ?? [];

  return keys;
};
