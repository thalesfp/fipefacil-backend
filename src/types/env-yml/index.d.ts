declare module "env-yml" {
  export default function (options?: {
    path?: string;
    encoding?: string;
    env?: string;
  }): void;
}
