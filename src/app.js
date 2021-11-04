const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const api = require("./routes/restVersionOneApis");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Hello ${req.ip}, how may i help you ❓`);
});

app.get("/users", (req, res) => {});

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", api);

// app.get("/*", (req, res) => {
//   return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;


