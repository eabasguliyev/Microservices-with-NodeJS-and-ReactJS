import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@eabasguliyev-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
