const mongoose = require("mongoose");

const multipleChoiceOptionSchema = new mongoose.Schema({
  id: String,
  text: {
    type: String,
    minlength: 1,
    maxlength: 50,
  },
  correct: {
    type: Boolean,
    required: true,
  },
});

module.exports = multipleChoiceOptionSchema;
