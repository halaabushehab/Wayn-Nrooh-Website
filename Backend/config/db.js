const mongoose = require("mongoose");
require("dotenv").config();
const dotenv = require('dotenv');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Atlas connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB Atlas connection error:", err);
    process.exit(1);
  }
};



module.exports = connectDB;