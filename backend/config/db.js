const mongoose = require("mongoose");

async function connectDataBase() {
  const conection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${conection.connection.host}`);
}

module.exports = connectDataBase;
