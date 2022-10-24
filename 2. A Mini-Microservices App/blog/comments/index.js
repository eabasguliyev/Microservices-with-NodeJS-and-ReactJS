const { randomBytes } = require("crypto");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const COMMENTS = {};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;

  res.json(COMMENTS[id]);
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const commentId = randomBytes(4).toString("hex");

  const comments = COMMENTS[id] || [];

  comments.push({ id: commentId, content });

  COMMENTS[id] = comments;

  await axios.post("http://localhost:5000/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: id,
    },
  });

  res.status(201).json(COMMENTS[id]);
});

app.listen(4001, () => {
  console.log("Listenin on 4001");
});
