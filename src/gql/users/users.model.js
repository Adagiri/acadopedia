const joi = require("joi");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueRandom = require("unique-random");
const { pick } = require("lodash");

const USERS = require("../../models/users.mongo");
const TOKENS = require("../../models/tokens.mongo");

const JWT_SECRET = process.env.JWT_SECRET;
const SENDER_EMAIL = "hello@yalla.ng";
const VERIFY_EMAIL_TEMPLATE = "VERIFY_EMAIL_WITH_CODE_V3";
const random = uniqueRandom(1, 9);

async function queryGetUser(userId) {
  return await USERS.findById(userId);
}

async function mutateLogin(loginInput) {
  let { email, password } = loginInput;
  try {
    const user = await USERS.findOne({ email });
    if (!user) {
      return { code: 404, success: false, message: "Email does not exist" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { code: 400, success: false, message: "Incorrect password" };
    }

    const token = signJwtToken(user);

    return {
      code: 200,
      success: true,
      message: "login successful",
      token,
      user,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function mutateSignup(signupInput) {
  const { error } = validateUser(signupInput);

  if (error) {
    return {
      code: 400,
      success: false,
      message: error.details[0].message,
    };
  }

  try {
    const registeredUser = await USERS.findOne({ email: signupInput["email"] });

    if (registeredUser) {
      return {
        code: 400,
        success: false,
        message: "An account is already registered with this email.",
      };
    }

    const code =
      random() + "" + random() + "" + random() + "" + random() + "" + random();

    const saveToken = await TOKENS.create({
      payload: Object.assign(signupInput, { code }),
      token: crypto.randomBytes(16).toString("hex"),
    });

    if (saveToken) {
      const payload = saveToken.payload;

      const verificationMail = await broadcastMail(
        broadcastMailParams(
          [payload["email"]],
          `{ code: ${payload["code"]}}`,
          SENDER_EMAIL,
          VERIFY_EMAIL_TEMPLATE
        )
      );

      if (verificationMail.Status[0].Status === "Success") {
        return {
          code: 200,
          success: true,
          message: "A verfication code was sent to " + payload["email"] + ".",
          token: saveToken.token,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

function signJwtToken(user) {
  const signupDetails = pick(user, [
    "email",
    "name",
    "isVerified",
    "isAdmin",
    "phoneNumber",
    "userRef",
    "roles",
    "_id",
  ]);
  const jwtToken = jwt.sign(signupDetails, JWT_SECRET, { expiresIn: "7d" });
  return jwtToken;
}

function broadcastMailParams(
  toAddresses,
  replacementTemplateData,
  senderEmail,
  emailTemplate
) {
  return {
    Destinations: [
      {
        Destination: {
          /* required */
          ToAddresses: toAddresses,
        },
        ReplacementTemplateData: replacementTemplateData,
      },
    ],
    Source: `Yalla <${senderEmail}>` /* required */,
    Template: emailTemplate /* required */,
    DefaultTemplateData: '{ null: "null"}',
    ReplyToAddresses: [senderEmail],
  };
}

module.exports = {
  queryGetUser,
  mutateLogin,
  mutateSignup,
};
