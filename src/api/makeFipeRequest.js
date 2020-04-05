const https = require("https");
const querystring = require("querystring");

const BASE_URL = "veiculos.fipe.org.br";
const DEFAULT_TIMEOUT_IN_MS = 10000;

const makeFipeRequest = async ({
  path,
  body = {},
  timeout = DEFAULT_TIMEOUT_IN_MS,
}) =>
  new Promise((resolve, reject) => {
    const postData = querystring.stringify(body);

    const options = {
      host: BASE_URL,
      port: 443,
      path: `/api/veiculos${path}`,
      method: "POST",
      headers: {
        referer: `https://${BASE_URL}/`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout,
    };

    const req = https.request(options, (res) => {
      res.setEncoding("utf8");

      let responseBody = "";

      res.on("data", (data) => {
        responseBody += data;
      });

      res.on("end", () => {
        responseBody = JSON.parse(responseBody);
        resolve(responseBody);
      });
    });

    req.on("timeout", () => {
      req.abort();
    });

    req.on("error", (e) => {
      reject(e.message);
    });

    req.write(postData);

    req.end();
  });

module.exports = { makeFipeRequest };
