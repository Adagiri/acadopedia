const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
  payload: Object,
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 900 },
});


module.exports =  mongoose.model("Token", tokensSchema);
