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

  await axios.post("http://event-bus-srv:5000/events", {
    type: "CommentCreated",
    data: {
      ...newComment,
      postId: id,
    },
  });

  res.status(201).json(COMMENTS[id]);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log(`Event received: ${type}`);

  switch (type) {
    case "CommentModerated":
      {
        const { id, content, postId, status } = data;

        const comments = COMMENTS[postId];

        const comment = comments.find((c) => c.id === id);

        comment.status = status;

        await axios.post("http://event-bus-srv:5000/events", {
          type: "CommentUpdated",
          data: {
            ...comment,
            postId,
          },
        });
      }
      break;

    default:
      break;
  }

  res.json({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Listenin on 4001");
});
