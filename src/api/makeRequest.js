const https = require("https");
const querystring = require("querystring");

const BASE_URL = "veiculos.fipe.org.br";

const makeRequest = async (path, body) =>
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

    req.on("error", (e) => {
      reject(e.message);
    });

    req.write(postData);

    req.end();
  });

module.exports = { makeRequest };
