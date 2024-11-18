import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import connectDb from "./db/db.js";
import { port } from "./config/config.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDb();

// Define Models
const SensorData = mongoose.model(
  "SensorData",
  new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now },
  })
);

const LedState = mongoose.model(
  "LedState",
  new mongoose.Schema({
    state: { type: String, enum: ["ON", "OFF"], default: "OFF" },
    updatedAt: { type: Date, default: Date.now },
  })
);

// Routes
app.get("/", (req, res) => res.send("Backend server is running!"));

// Sensor data endpoints
app.post("/api/sensor", async (req, res) => {
  const { temperature, humidity } = req.body;
  const data = new SensorData({ temperature, humidity });
  await data.save();
  res.status(201).json(data);
});

app.get("/api/sensor", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(1);
  res.json(data[0]);
});

// LED state endpoints
app.post("/api/led", async (req, res) => {
  const { state } = req.body;
  let ledState = await LedState.findOne();
  if (!ledState) {
    ledState = new LedState({ state });
  } else {
    ledState.state = state;
    ledState.updatedAt = Date.now();
  }
  await ledState.save();
  res.json(ledState);
});

app.get("/api/led", async (req, res) => {
  const ledState = await LedState.findOne();
  res.json(ledState ? ledState.state : "OFF");
});

// Start the server
const PORT = port || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
