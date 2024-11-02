const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log(`Database Connection on:${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error:${err}`);
    });
};

module.exports = dbConnection;
