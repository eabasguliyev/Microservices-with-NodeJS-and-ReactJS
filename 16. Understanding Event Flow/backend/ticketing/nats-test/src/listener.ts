import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticketCreatedListener";

console.clear();

const clientId = randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   // Event Redelivery
  //   .setDeliverAllAvailable()
  //   .setDurableName("tickets-service "); // durable subscriptions

  // // .setMaxInFlight()
  // // .setAckWait()
  // // .setDeliverAllAvailable()
  // // .setDurableName();

  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "ticketServiceQueueGroup",
  //   options
  // );

  // subscription.on("message", (msg: Message) => {
  //   console.log("Message received");

  //   const data = msg.getData();

  //   if (typeof data === "string") {
  //     console.log(`Received event $${msg.getSequence()}, with data: ${data}`);
  //   }

  //   msg.ack();
  // });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
