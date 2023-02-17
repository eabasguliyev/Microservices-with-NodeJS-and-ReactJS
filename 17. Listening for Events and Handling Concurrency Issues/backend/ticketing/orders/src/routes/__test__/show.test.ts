import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "test",
  });
  await ticket.save();

  // make a request to build an order with this ticket
  const cookie = await global.signup();

  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.data.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(createdOrder.data.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: "test",
  });
  await ticket.save();

  // make a request to build an order with this ticket
  const cookie = await global.signup();

  const { body: createdOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.data.id}`)
    .set("Cookie", await global.signup())
    .send()
    .expect(401);
});
