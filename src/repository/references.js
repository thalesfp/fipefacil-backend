const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const createReference = async (id, month, year) => {
  const params = {
    TableName: "references",
    Item: {
      id: { N: String(id) },
      month: { N: String(month) },
      year: { N: String(year) },
    },
  };

  return ddb.putItem(params).promise();
};

const getCurrentReferenceId = async () => {
  const params = {
    TableName: "references",
    ProjectionExpression: "id",
  };

  const references = await ddb.scan(params).promise();

  return references.Items.map(reference => parseInt(reference.id.N, 10)).reduce(
    (a, b) => Math.max(a, b),
    [],
  );
};

module.exports = { createReference, getCurrentReferenceId };
