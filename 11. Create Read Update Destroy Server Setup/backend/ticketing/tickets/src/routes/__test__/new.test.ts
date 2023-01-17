import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).not.toEqual(404);
});

it("can not be accessed if the user is not signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const token = await global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
  const token = await global.signup();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  const token = await global.signup();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({
      title: "test",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({
      title: "test",
      price: -10,
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const token = await global.signup();

  // add in a check to make sure a ticket was saved

  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const ticketData = {
    title: "test",
    price: 20,
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({ ...ticketData })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(ticketData.title);
  expect(tickets[0].price).toEqual(ticketData.price);
});
