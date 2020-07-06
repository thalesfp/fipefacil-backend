declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_REGION: string;
    AWS_DYNAMODB_ENDPOINT: string;
    AWS_SQS_ENDPOINT: string;
    REFERENCES_QUEUE: string;
    BRANDS_QUEUE: string;
    MODELS_QUEUE: string;
    YEAR_MODELS_QUEUE: string;
    PRICES_TABLE: string;
    REFERENCES_TABLE: string;
    UPDATE_FILES_BUCKET_NAME: string;
    UPDATE_FILES_BUCKET_REGION: string;
    AWS_S3_ENDPOINT: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  }
}

declare module "env-yml" {
  export default function (options?: {
    path?: string;
    encoding?: string;
    env: NodeJS.ProcessEnv;
  }): void;
}
