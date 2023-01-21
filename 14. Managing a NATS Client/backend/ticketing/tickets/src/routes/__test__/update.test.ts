import request from "supertest";
import { app } from "../../app";

import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const cookie = await global.signup();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).set("Cookie", cookie).send({
    title: "sdfsdds",
    price: 20,
  });
});

it("returns a 401 if the user is not authenticated", async () => {
  const cookie = await global.signup();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send({
    title: "sdfsdds",
    price: 20,
  });
});

it("returns a 401 if the user does not own the ticket", async () => {
  const cookie1 = await global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie1)
    .send({
      title: "test",
      price: 20,
    });

  const cookie2 = await global.signup();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({ title: "test2", price: 21 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test 2", price: -10 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = await global.signup();

  const creationResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    })
    .expect(201);

  const ticketData = { title: "test 2", price: 22 };

  await request(app)
    .put(`/api/tickets/${creationResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      ...ticketData,
    })
    .expect(200);

  const getResponse = await request(app)
    .get(`/api/tickets/${creationResponse.body.id}`)
    .send()
    .expect(200);

  expect(getResponse.body.title).toEqual(ticketData.title);
  expect(getResponse.body.price).toEqual(ticketData.price);
});

it("publishes an event", async () => {
  const cookie = await global.signup();

  const creationResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    })
    .expect(201);

  const ticketData = { title: "test 2", price: 22 };

  await request(app)
    .put(`/api/tickets/${creationResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      ...ticketData,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
