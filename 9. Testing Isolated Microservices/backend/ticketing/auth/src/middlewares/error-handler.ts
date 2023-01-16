import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(err.message);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
  } else {
    res.status(400).json({ errors: [{ message: "Something went wrong" }] });
  }
};
