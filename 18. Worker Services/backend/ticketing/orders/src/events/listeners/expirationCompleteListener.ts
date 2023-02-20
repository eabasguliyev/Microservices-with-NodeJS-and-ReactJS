import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@eabasguliyev-tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const existingOrder = await Order.findById(data.orderId);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    existingOrder.set({ status: OrderStatus.Cancelled });

    await new OrderCancelledPublisher(this.client).publish({
      id: existingOrder.id,
      ticket: {
        id: existingOrder.ticket.toString(),
      },
      version: existingOrder.version,
    });

    await existingOrder.save();

    msg.ack();
  }
}
