import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({ title: "concert", price: 20 });
  await ticket.save();

  // make a request to create an order
  const cookie = await global.signup();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.data.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled

  const updatedOrder = await Order.findById(order.data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
