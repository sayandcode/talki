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

  const processedResult = await processBody({
    parsedBody: bodyParseResult.data,
    sessionId: req.sessionID,
    nonce: req.session.nonce,
  });

  req.session.nonce = null; // reset the nonce regardless of success/failure
  if (!processedResult.success) {
    next(processedResult.error);
    return;
  }
  req.session.userData = processedResult.userData;

  res.status(200).json({
    msg: `Successfully logged in as ${req.session.userData.username}`,
  });
};

export default authLoginController;
