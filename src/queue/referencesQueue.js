const AWS = require("aws-sdk");

AWS.config.update({ region: "REGION" });

const sqs = new AWS.SQS();

const queueUrl = "a";

const sendMessage = async (referenceId, month, year) => {
  const params = {
    MessageAttributes: {
      ReferenceId: {
        DataType: "Number",
        StringValue: `${referenceId}`,
      },
      Month: {
        DataType: "String",
        StringValue: `${month}`,
      },
      Year: {
        DataType: "Number",
        StringValue: `${year}`,
      },
    },
    QueueUrl: queueUrl,
  };

  return sqs.sendMessage(params).promise();
};

module.exports = {
  sendMessage,
};
