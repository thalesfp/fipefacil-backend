if (!process.env.CI) {
  // eslint-disable-next-line global-require
  require("env-yml")();
}
