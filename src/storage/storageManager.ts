import { S3 } from "aws-sdk";
import { Readable } from "stream";

const {
  AWS_S3_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

// const s3ForcePathStyle = AWS_S3_ENDPOINT === "http://localhost:9000";

export const storageManager = (region: string): S3 =>
  new S3({
    region,
    // endpoint: AWS_S3_ENDPOINT,
    // accessKeyId: AWS_ACCESS_KEY_ID,
    // secretAccessKey: AWS_SECRET_ACCESS_KEY,
    // s3ForcePathStyle,
  });

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

export const listKeysInBucket = async (
  region: string,
  bucketName: string,
): Promise<string[]> => {
  const client = storageManager(region);

  const objects = await client.listObjects({ Bucket: bucketName }).promise();

  const keys = objects.Contents?.map((content) => content.Key ?? "") ?? [];

  return keys;
};
