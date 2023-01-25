import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@eabasguliyev-tickets/common";
import { Router, Request, Response } from "express";
import { param } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";

const router = Router();

router.delete(
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

    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundError();
    }

    if (existingOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    existingOrder.status = OrderStatus.Cancelled;

    await existingOrder.save();

    // publishing an event saying this was cancelled

    res.status(204).json(existingOrder);
  }
);

export { router as deleteOrderRouter };
