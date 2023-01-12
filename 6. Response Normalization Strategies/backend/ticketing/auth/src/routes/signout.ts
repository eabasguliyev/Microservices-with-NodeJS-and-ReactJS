import express from "express";

const router = express.Router();

router.get("/signout", (req, res) => {
  res.json({ message: "Signout!" });
});

export { router as signoutRouter };
