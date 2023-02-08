import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticketCreatedPublisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    const eventId = await publisher.publish({
      id: "12",
      title: "test ticket",
      price: 21,
    });

    console.log("Event id", eventId);
  } catch (error) {
    console.log(error);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
