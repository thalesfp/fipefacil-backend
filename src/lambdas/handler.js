"use strict";

const AWS = require("aws-sdk");
const axios = require("axios");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.hello = async () => {
  const timestamp = new Date().getTime();

  const { data: brands } = await axios.get(
    "https://tabela-fipe-api-node.herokuapp.com/carros/marcas",
  );

  brands.map(brand => {
    dynamoDb.put({
      TableName: "brands",
      Item: {
        id: parseInt(brand.Value, 10),
        name: brand.Label,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });
  });

  dynamoDb.get({});

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
    }),
  };
};
