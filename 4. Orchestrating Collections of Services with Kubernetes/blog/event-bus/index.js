const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const SERVICES = {
  post: "http://localhost:4000/events",
  comment: "http://localhost:4001/events",
  query: "http://localhost:4002/events",
  moderation: "http://localhost:4003/events",
};

const EVENTS = [];

const app = express();

app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  EVENTS.push(event);

  Object.values(SERVICES).map(async (serviceUrl) => {
    try {
      await axios.post(serviceUrl, event);
    } catch (error) {
      console.log(error);
    }
  });

  res.json({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.json(EVENTS);
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
