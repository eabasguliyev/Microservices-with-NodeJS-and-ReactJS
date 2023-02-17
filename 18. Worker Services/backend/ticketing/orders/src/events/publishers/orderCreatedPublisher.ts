import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@eabasguliyev-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
