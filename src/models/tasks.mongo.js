const mongoose = require("mongoose");

const multipleChoiceOptionSchema = require("./multipleChoiceOptions.mongo");

const tasksSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "FILL_THE_GAP", "TRUE_OR_FALSE"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
  },
  text: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  ftg: {
    type: String,
  },
  options: {
    type: [multipleChoiceOptionSchema],
  },
  tof: {
    type: Boolean,
  },
  category: {
    type: [String],
    required: true,
  },
  likes: {
    type: Number,
  },
  refs: {
    type: String,
  },
  author: {
    name: String,
    _id: mongoose.SchemaTypes.ObjectId,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", tasksSchema);
