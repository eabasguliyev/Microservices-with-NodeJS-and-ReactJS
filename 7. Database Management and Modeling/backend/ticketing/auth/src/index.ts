import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose, { mongo } from "mongoose";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/notFoundError";

const app = express();

app.use(json());

app.use("/api/users", currentUserRouter);
app.use("/api/users", signinRouter);
app.use("/api/users", signoutRouter);
app.use("/api/users", signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const connectMongoDb = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb.");
  } catch (error) {
    console.error(error);
  }
};

app.listen(3000, async () => {
  console.log("Listening on port 3000!!!!!");

  await connectMongoDb();
});
