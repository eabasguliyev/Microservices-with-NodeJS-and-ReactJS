import express from "express";

const router = express.Router();

router.get("/signin", (req, res) => {
  res.json({ message: "Signin!" });
});

export { router as signinRouter };
