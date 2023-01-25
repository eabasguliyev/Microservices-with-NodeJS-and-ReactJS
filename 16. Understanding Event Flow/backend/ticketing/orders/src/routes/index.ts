import { Router, Request, Response } from "express";
import { Order } from "../models/order";
import { requireAuth } from "@eabasguliyev-tickets/common";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const activeOrders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.json(activeOrders);
});

export { router as indexOrderRouter };
