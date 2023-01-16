import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose, { mongo } from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/notFoundError";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({ signed: false, secure: true }));

app.use("/api/users", currentUserRouter);
app.use("/api/users", signinRouter);
app.use("/api/users", signoutRouter);
app.use("/api/users", signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb.");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, async () => {
    console.log("Listening on port 3000!!!!!");
  });
};

start();
