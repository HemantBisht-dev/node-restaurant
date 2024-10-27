// Using Node.js `require()`
const mongoose = require("mongoose");

// Define the MongoDB connection URL
const mongoUrl = "mongodb://localhost:27017/hotel";

// set up mongodb connection
mongoose.connect(mongoUrl);

// get the default connection
// Mongoose maintains a default connections object representing the MongoDB connection
const db = mongoose.connection;

// define event listener for database connection
db.on("connected", () => {
  console.log("connected to mongodb");
});
db.on("error", (error) => {
  console.log("mongodb connection error", error);
});
db.on("disconnected", () => {
  console.log("Mongodb disconnected");
});

module.exports = db;
