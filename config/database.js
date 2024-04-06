const mongoose = require("mongoose");
const config = require("./config");

function connectToMongoDB() {
  const uri = config.get('mongoDb');

  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1);
    });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed due to application termination");
      process.exit(0);
    });
  });
}

module.exports = connectToMongoDB;
