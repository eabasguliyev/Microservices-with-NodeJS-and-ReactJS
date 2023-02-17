import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@eabasguliyev-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
