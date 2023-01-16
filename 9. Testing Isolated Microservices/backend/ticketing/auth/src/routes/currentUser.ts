import express from "express";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/currentUser", currentUser, (req, res) => {
  if (!req.session?.jwt) {
    return res.json({ currentUser: null });
  }

  res.json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
