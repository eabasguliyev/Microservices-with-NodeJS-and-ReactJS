import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
} from "@eabasguliyev-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
