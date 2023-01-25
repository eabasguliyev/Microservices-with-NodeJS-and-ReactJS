import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@eabasguliyev-tickets/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/order";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = Router();

router.get(
  "/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("OrderId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const existingOrder = await Order.findById(orderId).populate("ticket");

    if (!existingOrder) {
      throw new NotFoundError();
    }

    if (existingOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.json(existingOrder);
  }
);

export { router as showOrderRouter };
