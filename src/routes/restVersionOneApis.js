const express = require("express");

const launchesRouter = require("./versionOne/launches/launches.route");
const planetsRouter = require("./versionOne/planets/planets.route");

const restVersionOneApis = express.Router();

restVersionOneApis.use("/planets", planetsRouter);
restVersionOneApis.use("/launches", launchesRouter);

module.exports = restVersionOneApis;;
