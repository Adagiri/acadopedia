const joi = require("joi");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqueRandom = require("unique-random");
const { pick } = require("lodash");

const USERS = require("../../models/users.mongo");
const TOKENS = require("../../models/tokens.mongo");
const NEWS_LETTER_SUBSCRIBERS = require("../../models/newsLetterSubscribers.mongo");
const { broadcastMail } = require("../../services/aws");

const ENDPOINT = process.env.ENDPOINT;
const JWT_SECRET = process.env.JWT_SECRET;
const SENDER_EMAIL = "hello@yalla.ng";
const VERIFY_EMAIL_TEMPLATE = "VERIFY_EMAIL_WITH_CODE_V3";
const SIGNUP_TEMPLATE = "SIGNUP_V1";
const FORGOT_PASSWORD_MAIL_TEMPLATE = "FORGOT_PASSWORD_MAIL_V4";
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
        createBroadcastMailParams(
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

async function mutateVerifyEmail(verifyEmailInput) {
  try {
    const savedToken = await TOKENS.findOne({ token: verifyEmailInput.token });

    if (!savedToken) {
      return {
        code: 404,
        success: false,
        message: "Token not found. Token may have expired.",
      };
    }

    if (savedToken["payload"]["code"] !== verifyEmailInput.code) {
      return {
        code: 400,
        success: false,
        message: "The code you entered is incorrect.",
      };
    }

    let { code, ...signupDetails } = savedToken.payload;
    signupDetails.isVerified = true;

    const salt = await bcrypt.genSalt(10);
    signupDetails.password = await bcrypt.hash(signupDetails.password, salt);

    let existingUser = await USERS.findOne({ email: signupDetails.email });

    if (existingUser) {
      return {
        code: 400,
        success: false,
        message:
          "There is an account already registered with " + signupDetails.email,
      };
    }

    const user = await USERS.create(signupDetails);

    if (user) {
      await Promise.all([
        TOKENS.remove({ token: savedToken["token"] }),
        NEWS_LETTER_SUBSCRIBERS.updateOne(
          { email: user["email"] },
          { email: user["email"] },
          { upsert: true }
        ),
      ]);

      const token = signJwtToken(user);

      const confirmationMail = await broadcastMail(
        createBroadcastMailParams(
          [user["email"]],
          `{ name: ${user["firstName"]} }`,
          SENDER_EMAIL,
          SIGNUP_TEMPLATE
        )
      );

      if (confirmationMail.Status[0].Status === "Success") {
        return {
          code: 200,
          success: true,
          message: "Verification successful",
          token,
          user,
        };
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function mutateResendCode(token) {
  try {
    // Search for the token if it has not yet expired
    const savedToken = await TOKENS.findOne({ token });

    if (!savedToken) {
      return {
        code: 404,
        success: false,
        message: "Token not found. Try signing up again.",
      };
    }

    // Confirm that no user has already registered with the email found in the token doc
    const existingUser = await USERS.findOne({
      email: savedToken["payload"]["email"],
    });

    if (existingUser) {
      return new DefaultResponse(
        400,
        false,
        "There is an account registered with this email already"
      );
    }

    // All tokens expire after 15 mins. updating the createdAt field to the current time refreshes the tokens lifespan to 15 mins
    const updateToken = await TOKENS.findOneAndUpdate(
      { token },
      { $set: { createdAt: new Date() } }
    );

    if (updateToken) {
      const payload = updateToken.payload;

      // resend the verification code to the users' email
      const verificationMail = await broadcastMail(
        createBroadcastMailParams(
          [payload["email"]],
          `{ code: ${payload["code"]} }`,
          SENDER_EMAIL,
          VERIFY_EMAIL_TEMPLATE
        )
      );
      if (verificationMail["Status"][0]["Status"] === "Success") {
        return {
          code: 200,
          success: true,
          message: "A verfication code was resent to " + payload["email"] + ".",
          token: payload["token"],
        };
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function mutateForgotPassword(email) {
  try {
    const existingUser = await USERS.findOne({ email });

    if (!existingUser) {
      return {
        code: 404,
        success: false,
        message: "Invalid email",
      };
    }

    const token = crypto.randomBytes(16).toString("hex");

    const saveToken = await TOKENS.create({
      payload: { email },
      token,
    });

    if (saveToken) {
      const forgotPasswordMail = await broadcastMail(
        createBroadcastMailParams(
          [existingUser["email"]],
          `{ "name": ${existingUser["firstName"]}, "link": "${ENDPOINT}/#/resetPassword/${token}"} }`,
          SENDER_EMAIL,
          FORGOT_PASSWORD_MAIL_TEMPLATE
        )
      );

      if (forgotPasswordMail["Status"][0]["Status"] === "Success") {
        return {
          code: 200,
          success: true,
          message: `A password reset link has been sent to ${email}`,
        };
      } else {
        return {
          code: 500,
          success: false,
          message: `Failed to send mail`,
        };
      }
    }
  } catch (error) {
    throw error;
  }
}

async function mutateResetPassword(resetPasswordInput) {
  const { token, password } = resetPasswordInput;

  const { error } = joi
    .object({
      password: joi
        .string()
        .required()
        .pattern(/(?=.{8,30})(?=\D*\d)(?=.*[A-Z])(?=.*\W)(?!.*\s)/),
      token: joi.string().required(),
    })
    .validate(resetPasswordInput);

  if (error) {
    return {
      code: 400,
      success: false,
      message: error["details"][0]["message"],
    };
  }

  try {
    const savedToken = await TOKENS.findOne({ token });

    if (!savedToken) {
      return {
        code: 404,
        success: false,
        message: "Token not found, Try signing up again.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    const updateUser = await USERS.findOneAndUpdate(
      { email: savedToken["payload"]["email"] },
      { $set: { password: newPassword } }
    );

    if (updateUser) {
      return {
        code: 200,
        success: true,
        message: "Password reset successful",
      };
    } else {
      return {
        code: 500,
        success: false,
        message: "Something went wrong",
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function mutateEditProfile(editProfileInput, userId) {
  try {
    const user = await USERS.findByIdAndUpdate(userId, {
      $set: editProfileInput,
    }, {new: true});
    if (user) {
      return {
        code: 200,
        success: true,
        message: "Profile update successful",
        user,
      };
    } else {
      return {
        code: 500,
        success: false,
        message: "Failed to update profile",
      };
    }
  } catch (error) {
    throw new Error(error);
  }

}

function validateUser(userInput) {
  const schema = joi.object({
    firstName: joi.string().min(3).max(30).required(),
    lastName: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .required()
      .pattern(/(?=.{8,30})(?=\D*\d)(?=.*[A-Z])(?=.*\W)(?!.*\s)/),
    phoneNumber: joi.string().required(),
    receiveNewsLetter: joi.boolean().required(),
  });
  return schema.validate(userInput);
}

function validateSubscriptions(email) {
  const schema = {
    email: Joi.string().email(),
  };

  return Joi.validate({ email }, schema);
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

function createBroadcastMailParams(
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
  mutateVerifyEmail,
  mutateResendCode,
  mutateForgotPassword,
  mutateResetPassword,
  mutateEditProfile,
};
