const { randomBytes } = require("crypto");

const express = require("express");
const bodyParser = require("body-parser");

const POSTS = {};

const app = express();

app.use(bodyParser.json());
app.get("/posts", (req, res) => {
  res.json(POSTS);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { title } = req.body;

  POSTS[id] = {
    id,
    title,
  };

  res.status(201).json(POSTS[id]);
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
