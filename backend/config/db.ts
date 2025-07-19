import mongoose from "mongoose";

async function connectDataBase() {
  const conection = await mongoose.connect(process.env.MONGO_URI as string);
  console.log(`MongoDB connected: ${conection.connection.host}`);
}

export default connectDataBase;
