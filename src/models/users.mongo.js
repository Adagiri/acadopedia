const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  roles: [{ type: "String" }],
  isVerified: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },

  newPassword: {
    type: String,
    minlength: 6,
    maxlength: 255,
  },
  newPin: {
    type: String,
  },
  oldPin: {
    type: String,
  },
  accountName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankCode: {
    type: String,
  },
  cardName: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  cardExpiry: {
    type: String,
  },
  cardCVV: {
    type: String,
  },
  userRef: {
    type: String,
  },
  signupDate: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isPinSet: {
    type: Boolean,
    default: false,
  },
  isAccountSet: {
    type: Boolean,
    default: false,
  },
  isCardDetailsSet: {
    type: Boolean,
    default: false,
  },
  visaApplicationCount: {
    type: Number,
    default: 0,
  },
  bookingCount: {
    type: Number,
    default: 0,
  },
  savingPlanCount: {
    type: Number,
    default: 0,
  },
  bookingDetails: {
    type: Object,
  },
});

module.exports = mongoose.model("User", usersSchema)
