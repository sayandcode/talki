import { RequestHandler } from "express";
import { ApiError } from "middleware/errors";
import { fromZodError } from "zod-validation-error";
import AuthLoginBodyValidator from "./validators";
import processBody from "./processBody";
import { COOKIE_NONCE_ID_KEY } from "../nonce/controller";

type UserData = {
  userId: string;
  username: string;
  verified: boolean;
};

declare module "express-session" {
  interface SessionData {
    userData: UserData;
  }
}

const authLoginController: RequestHandler = async (req, res, next) => {
  const bodyParseResult = AuthLoginBodyValidator.safeParse(req.body);
  if (!bodyParseResult.success) {
    const errMsg = fromZodError(bodyParseResult.error).message;
    next(new ApiError(400, errMsg));
    return;
  }

  const loginAttemptResult = await processBody({
    parsedBody: bodyParseResult.data,
    req,
  });

  if (loginAttemptResult instanceof ApiError) {
    next(loginAttemptResult);
    return;
  }

  // make a new session on successful login
  req.session.regenerate((regenErr) => {
    if (regenErr) {
      next(regenErr);
      return;
    }

    req.session.userData = loginAttemptResult;
    res.clearCookie(COOKIE_NONCE_ID_KEY);
    res.status(200).json({
      msg: `Successfully logged in as ${req.session.userData.username}`,
    });
  });
};

export default authLoginController;
