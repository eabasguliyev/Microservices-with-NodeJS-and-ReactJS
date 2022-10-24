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

  const newComment = { id: commentId, content, status: "pending" };

  comments.push(newComment);

  COMMENTS[id] = comments;

  await axios.post("http://localhost:5000/events", {
    type: "CommentCreated",
    data: {
      ...newComment,
      postId: id,
    },
  });

  res.status(201).json(COMMENTS[id]);
});

app.post("/events", (req, res) => {
  const { type } = req.body;

  console.log(`Event received: ${type}`);

  res.json({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Listenin on 4001");
});
