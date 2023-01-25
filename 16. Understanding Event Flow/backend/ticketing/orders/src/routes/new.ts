import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import { body } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@eabasguliyev-tickets/common";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database

    const existingTicket = await Ticket.findById(ticketId);

    if (!existingTicket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved

    const isReserved = await existingTicket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database

    const existingOrder = Order.build({
      ticket: existingTicket,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
    });

    await existingOrder.save();

    // Publish an event saying that an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: existingOrder.id,
      expiresAt: existingOrder.expiresAt.toISOString(),
      status: existingOrder.status,
      userId: req.currentUser!.id,
      ticket: {
        id: existingOrder.ticket.id,
        price: existingOrder.ticket.price,
      },
    });

    res.status(201).json({ message: "Order created", data: existingOrder });
  }
);

export { router as newOrderRouter };
