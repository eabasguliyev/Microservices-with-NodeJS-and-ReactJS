const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const POSTS = {};
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

  console.log(POSTS);
  res.json({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
