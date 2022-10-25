const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const POSTS = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;

      POSTS[id] = {
        id,
        title,
        comments: [],
      };
      break;
    }
    case "CommentCreated": {
      const { id, content, status, postId } = data;

      const post = POSTS[postId];

      post.comments.push({ id, content, status });
      break;
    }
    case "CommentUpdated":
      {
        const { id, content, status, postId } = data;
        const post = POSTS[postId];

        const comment = post.comments.find((item) => item.id === id);

        comment.status = status;
        comment.content = content;
      }
      break;
    default:
      break;
  }
};
/**
 *  QUICK EXAMPLE
 * posts {
 *  'key': {
 *  id: "",
 *  title: "",
 *  comments: [{
 *    id: '',
 *    content: ""
 *  },
 *  {
 *    id: '',
 *    content: ""
 *  }]
 * }
 * }
 *
 */
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.json(POSTS);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.json({});
});

app.listen(4002, async () => {
  const response = await axios.get("http://localhost:5000/events");

  const events = response.data;

  events.forEach((event) => {
    console.log("Processing event:", event.type);

    handleEvent(event.type, event.data);
  });
  console.log("Listening on 4002");
});
