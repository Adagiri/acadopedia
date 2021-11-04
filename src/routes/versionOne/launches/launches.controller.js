const {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunch,
  scheduleLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../../services/query");

async function httpGetAllLaunches(req, res) {
  const {limit, skip} = getPagination(req.query);

  res.status(200).json(await getAllLaunches(limit, skip));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.target ||
    !launch.rocket
  ) {
    return res.status(400).json({ error: "Missing required launch property" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invalid launch date" });
  }
  await scheduleLaunch(launch);
  res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  let launchId = req.params.id;

  if (!launchId) {
    return res.status(400).json({ message: "Launch id is missing" });
  }

  launchId = Number(launchId);

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({ message: "Launch not found" });
  }
  console.log("starting aborting launch");
  const abort = await abortLaunch(launchId);
  if (abort) {
    return res.status(200).json({ ok: true });
  }

  res.status(400).json({ message: "Failed to abort mission" });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
