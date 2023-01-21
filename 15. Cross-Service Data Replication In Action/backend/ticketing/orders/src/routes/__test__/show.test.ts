import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const cookie = await global.signup();

  const ticketData = { title: "test", price: 20 };

  const creationResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ ...ticketData })
    .expect(201);

  const getResponse = await request(app)
    .get(`/api/tickets/${creationResponse.body.id}`)
    .send()
    .expect(200);

  expect(creationResponse.body.id).toEqual(getResponse.body.id);
  expect(creationResponse.body.title).toEqual(getResponse.body.title);
  expect(creationResponse.body.price).toEqual(getResponse.body.price);
});
