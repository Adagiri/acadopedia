const mongoose = require("mongoose");

const multipleChoiceOptionsSchema = require("./multipleChoiceOptions.mongo");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  authId: {
    type: String,
    required: true,
  },
  pinned_tasks: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: [],
  },
  tasks_count: {
    type: Number,
  },
});

module.exports = mongoose.model("User", usersSchema);
