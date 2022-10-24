const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const SERVICES = {
  post: "http://localhost:4000/events",
  comment: "http://localhost:4001/events",
  query: "http://localhost:4002/events",
  moderation: "http://localhost:4003/events",
};

const app = express();

app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  Object.values(SERVICES).map((serviceUrl) => axios.post(serviceUrl, event));

  res.json({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
