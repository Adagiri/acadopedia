const aws = require("aws-sdk");

const AWS_ID = process.env.AWS_ID;
const AWS_KEY = process.env.AWS_KEY;
const AWS_SES_REGION = process.env.AWS_SES_REGION;

const S3 = new aws.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_KEY,
});

const AWS_SES = new aws.SES({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_KEY,
  region: AWS_SES_REGION,
});




const getMailTemplates = () => {
  return AWS_SES.listTemplates({ MaxItems: 100 }).promise();
};

const createMailTemplate = (params) => {
  return AWS_SES.createTemplate(params).promise();
};

const deleteMailTemplate = (templateName) => {
  return AWS_SES.deleteTemplate({ TemplateName: templateName }).promise();
};

const sendEmail = async (params) => {
  try {
    const data = await AWS_SES.sendEmail(params).promise();
    return data.MessageId;
  } catch (error) {
    throw error;
  }
};


const broadcastMail = (params) =>
  AWS_SES.sendBulkTemplatedEmail(params).promise();

module.exports = {
  createMailTemplate,
  deleteMailTemplate,
  getMailTemplates,
  broadcastMail,
  sendEmail,
};

// export const getSignedUrl = async (key) => {
//   try {
//     const url = await S3.getSignedUrl("putObject", {
//       Bucket: "krowdee-prime-123",
//       ContentType: "jpeg",
//       Key: key,
//     });
//     console.log(url);
//     return url;
//   } catch (error) {
//     throw error;
//   }
//   // return url.url
// };
