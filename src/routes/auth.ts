import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.json(req.session);
});

export default authRouter;
