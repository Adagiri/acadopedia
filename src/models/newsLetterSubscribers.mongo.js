const mongoose = require("mongoose");
const Joi = require("joi");

const newsLetterSubscribers = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NewsLetterSubscribers", newsLetterSubscribers);
