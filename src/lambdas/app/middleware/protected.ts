import { RequestHandler } from "express";
import { ApiError } from "./errors";

const protectWithAuth: RequestHandler = (req, _, next) => {
  const isLoggedIn = !!req.session.userData;
  if (isLoggedIn) next();
  else next(new ApiError(401, "Login to use this resource"));
};

export default protectWithAuth;
