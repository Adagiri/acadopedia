const mongoose = require("mongoose");

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
  roles: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isModerator: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", usersSchema);
