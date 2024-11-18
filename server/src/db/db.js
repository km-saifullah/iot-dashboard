import mongoose from "mongoose";
import { dbURL } from "../config/config.js";
const connectDb = async () => {
  try {
    await mongoose.connect(dbURL);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
