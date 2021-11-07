const mongoose = require("mongoose");

const multipleChoiceOptionSchema = new mongoose.Schema({
  id: String,
  text: {
    type: String,
    minlength: 1,
  },
  c: {
    type: Boolean,
    required: true,
  },
});

module.exports = multipleChoiceOptionSchema;
