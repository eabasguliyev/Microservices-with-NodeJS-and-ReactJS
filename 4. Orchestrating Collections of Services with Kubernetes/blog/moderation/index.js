const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Received event:", type);
  switch (type) {
    case "CommentCreated":
      {
        const { id, content, postId } = data;

        const status = content.includes("orange") ? "rejected" : "approved";

        setTimeout(async () => {
          await axios.post("http://event-bus-srv:5000/events", {
            type: "CommentModerated",
            data: {
              id,
              content,
              postId,
              status,
            },
          });
        }, 15000);
      }
      break;

    default:
      break;
  }

  res.json({ status: "OK" });
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
