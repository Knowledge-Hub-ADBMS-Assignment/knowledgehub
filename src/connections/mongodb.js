const mongoose = require("mongoose");
const connectToMongoDB = (connectionString) => {
  return mongoose.connect(connectionString, {}, (error) => {
    if (!error) {
      return console.log("Mongodb connected successfully");
    }

    console.log("Mongodb not connected");
  });
};


module.exports = connectToMongoDB;