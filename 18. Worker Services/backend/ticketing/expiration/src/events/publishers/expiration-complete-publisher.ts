import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@eabasguliyev-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
