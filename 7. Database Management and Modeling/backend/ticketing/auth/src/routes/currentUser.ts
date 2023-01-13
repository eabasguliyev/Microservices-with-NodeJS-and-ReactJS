import express from "express";

const router = express.Router();

router.get("/currentUser", (req, res) => {
  res.json({ message: "Hi there!" });
});

export { router as currentUserRouter };
