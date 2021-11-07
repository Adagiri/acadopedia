const mongoose = require("mongoose");

const multipleChoiceOptionSchema = require("./multipleChoiceOptions.mongo");

const tasksSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "FILL_GAP", "BOOLEAN"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
  },
  question: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  fill_gap: {
    type: String,
  },
  multiple_choice: {
    type: Array
  },
  boolean: {
    type: Boolean,
  },
  category: {
    type: [String],
    required: true,
  },
  likes: {
    type: Number,
  },
  ref: {
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
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", tasksSchema);
