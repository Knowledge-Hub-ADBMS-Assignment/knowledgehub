require('dotenv').config();
module.exports = {
  databaseConnections: {
    mongodb: process.env.MONGODB,
  },
  sessionSecret: process.env.SECRET
};
