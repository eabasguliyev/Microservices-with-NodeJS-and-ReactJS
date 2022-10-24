const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const SERVICES_URL = [
  "http://localhost:4000/events",
  "http://localhost:4001/events",
  "http://localhost:4002/events",
];

const app = express();

app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  SERVICES_URL.map((serviceUrl) => axios.post(serviceUrl, event));

  res.json({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Listening on 5000");
});
