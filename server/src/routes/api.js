const express = require("express");
const SensorData = require("../models/SensorData");
const LedState = require("../models/LedState");
const router = express.Router();

router.post("/sensor", async (req, res) => {
  const { temperature, humidity } = req.body;
  const data = new SensorData({ temperature, humidity });
  await data.save();
  res.status(201).send(data);
});

router.get("/sensor", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(1);
  res.send(data[0]);
});

router.get("/led", async (req, res) => {
  const state = await LedState.findOne();
  res.send(state ? state.state : "OFF");
});

router.post("/led", async (req, res) => {
  const { state } = req.body;
  let ledState = await LedState.findOne();
  if (!ledState) ledState = new LedState();
  ledState.state = state;
  ledState.updatedAt = Date.now();
  await ledState.save();
  res.send(ledState);
});

module.exports = router;
