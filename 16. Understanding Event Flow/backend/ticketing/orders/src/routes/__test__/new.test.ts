import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toString();

  const cookie = await global.signup();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "test ticket",
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Complete,
    ticket: ticket,
    userId: new mongoose.Types.ObjectId().toString(),
    expiresAt: new Date(),
  });

  await order.save();

  const cookie = await global.signup();

  request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "test ticket",
  });

  await ticket.save();

  const cookie = await global.signup();

  request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("emits an order created event");
