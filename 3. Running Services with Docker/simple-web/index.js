const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "How are u?",
  });
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});
