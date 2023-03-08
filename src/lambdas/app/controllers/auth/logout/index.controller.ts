import { RequestHandler } from "express";

const authLogoutController: RequestHandler = (req, res, next) => {
  req.session.destroy((errInDestroying) => {
    if (errInDestroying) {
      next(errInDestroying);
      return;
    }
    res.status(200).json({ msg: "Successfully logged out" });
  });
};

export default authLogoutController;
