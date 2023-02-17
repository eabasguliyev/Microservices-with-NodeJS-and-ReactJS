import { requireAuth, validateRequest } from "@eabasguliyev-tickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const createdTicket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id.toString(),
    });

    await createdTicket.save();

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: createdTicket.id,
      title: createdTicket.title,
      price: createdTicket.price,
      userId: createdTicket.userId,
      version: createdTicket.version,
    });

    res.status(201).json(createdTicket);
  }
);

export { router as createTicketRouter };
