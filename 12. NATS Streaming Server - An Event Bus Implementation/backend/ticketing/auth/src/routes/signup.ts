import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@eabasguliyev-tickets/common";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const hashedPassword = password;

    const newUser = User.build({ email, password: hashedPassword });

    const createdUser = await newUser.save();

    // Generate JWT
    const userJwt = jwt.sign(
      { id: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY!
    );

    // Store it on session object

    req.session = {
      jwt: userJwt,
    };

    res.status(201).json({ message: "User created", data: createdUser });
  }
);

export { router as signupRouter };
