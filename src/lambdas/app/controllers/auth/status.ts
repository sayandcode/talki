import { RequestHandler } from "express";

const authStatusController: RequestHandler = (req, res) => {
  const isLoggedIn = !!req.session.userData;
  res.status(200).json({ isLoggedIn });
};

export default authStatusController;
