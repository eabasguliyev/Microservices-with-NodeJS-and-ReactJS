import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb.");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, async () => {
    console.log("Listening on port 3000!!!!!");
  });
};

start();
