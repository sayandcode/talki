import { Request } from "express";
import { SessionData } from "express-session";
import { ApiError } from "middleware/errors";
import verifyGoogleIdToken from "services/auth/google";
import DatabaseClients from "services/db";
import getCookiesObjFromString from "utils/getCookies";
import { COOKIE_NONCE_ID_KEY } from "../nonce/controller";
import { getNonceFromDb, removeNonceFromDb } from "../nonce/saveNonce";

function makeUserProcessors(databaseClients: DatabaseClients) {
  function processAnonUser(
    name: string,
    sessionId: Request["sessionID"]
  ): SessionData["userData"] {
    return {
      userId: sessionId,
      username: name,
      verified: false,
    };
  }

  async function processGoogleUser(
    idToken: Parameters<typeof verifyGoogleIdToken>[0]["idToken"],
    cookieString: Parameters<typeof getCookiesObjFromString>[0]
  ): Promise<SessionData["userData"] | ApiError> {
    const cookiesObj = getCookiesObjFromString(cookieString);
    const nonceId = cookiesObj[COOKIE_NONCE_ID_KEY];
    if (!nonceId)
      return new ApiError(400, "Request nonce before attempting login");

    const nonce = await getNonceFromDb(nonceId, databaseClients.redisClient);
    if (!nonce)
      return new ApiError(400, "Denied due to suspected replay attack");

    const userData = await verifyGoogleIdToken({ idToken, nonce });
    if (!userData)
      return new ApiError(400, "Denied due to suspected replay attack");

    await removeNonceFromDb(nonceId, databaseClients.redisClient);
    return userData;
  }
  return { processAnonUser, processGoogleUser };
}

export default makeUserProcessors;
