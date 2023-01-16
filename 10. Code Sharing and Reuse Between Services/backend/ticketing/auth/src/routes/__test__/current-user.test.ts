import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.signup();

  expect(cookie).toBeDefined();

  const currentUserResponse = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(currentUserResponse.body.currentUser.email).toEqual("test@test.com");
});
