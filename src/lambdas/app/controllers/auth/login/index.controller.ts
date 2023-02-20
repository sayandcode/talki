import { ApiError } from "@appLambda/middleware/errors";
import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import DatabaseClients from "@appLambda/services/db";
import makeTypedBodyController from "@appLambda/utils/reqRes/typedParsedBody";
import AuthLoginBodyValidator from "./validators";
import processBody from "./processBody";
import { COOKIE_NONCE_ID_KEY } from "../nonce/index.controller";

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

function makeAuthLoginController(databaseClients: DatabaseClients) {
  return makeAsyncController(
    makeTypedBodyController(AuthLoginBodyValidator, async (req, res, next) => {
      const loginAttemptResult = await processBody({
        parsedBody: req.body,
        req,
        databaseClients,
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
    })
  );
}

export default makeAuthLoginController;
