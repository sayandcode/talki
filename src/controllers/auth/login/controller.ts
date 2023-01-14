import { RequestHandler } from "express";
import { ApiError } from "middleware/errors";
import { fromZodError } from "zod-validation-error";
import AuthLoginBodyValidator from "./validators";
import processBody from "./processBody";

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

  if (!req.session.nonce) {
    next(new ApiError(400, "Denied due to suspected replay attack"));
    return;
  }
  const loginAttemptResult = await processBody({
    parsedBody: bodyParseResult.data,
    sessionId: req.sessionID,
    nonce: req.session.nonce,
  });

  if (!loginAttemptResult.success) {
    next(loginAttemptResult.error);
    return;
  }

  // make a new session on successful login
  req.session.regenerate((regenErr) => {
    if (regenErr) {
      next(regenErr);
      return;
    }

    req.session.userData = loginAttemptResult.userData;
    res.status(200).json({
      msg: `Successfully logged in as ${req.session.userData.username}`,
    });
  });
};

export default authLoginController;
