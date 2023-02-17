import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@eabasguliyev-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
