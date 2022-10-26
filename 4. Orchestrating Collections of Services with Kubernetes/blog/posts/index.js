const { randomBytes } = require("crypto");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const POSTS = {};

const app = express();

app.use(bodyParser.json());
app.use(cors());

// app.get("/posts", (req, res) => {
//   res.json(POSTS);
// });

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { title } = req.body;

  POSTS[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-srv:5000/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).json(POSTS[id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;

  console.log(`Received Event: ${type}`);

  res.json({ status: "OK" });
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
