import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@eabasguliyev-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const existingTicket = await Ticket.findById(data.ticket.id);

    // If not ticket, throw error
    if (!existingTicket) {
      throw new Error("Ticket not found");
    }

    existingTicket.set({ orderId: undefined });

    // Save the ticket
    await existingTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: existingTicket.id,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
      orderId: existingTicket.orderId,
      version: existingTicket.version,
    });

    // ack the message
    msg.ack();
  }
}
