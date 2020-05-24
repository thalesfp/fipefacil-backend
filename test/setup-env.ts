import envYml from "env-yml";

if (!process.env.CI) {
  envYml();
}
