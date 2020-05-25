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
  }
}

declare module "env-yml" {
  export default function (options?: {
    path?: string;
    encoding?: string;
    env?: string;
  }): void;
}
