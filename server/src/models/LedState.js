const mongoose = require("mongoose");

const ledStateSchema = new mongoose.Schema({
  state: { type: String, enum: ["ON", "OFF"], default: "OFF" },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LedState", ledStateSchema);
