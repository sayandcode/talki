import { RequestHandler } from "express";

const authStatusController: RequestHandler = (req, res) => {
  const { userData } = req.session;
  const isLoggedIn = !!userData;
  res.status(200).json({ isLoggedIn, userData });
};

export default authStatusController;
