import { Request } from "express";
import { SessionData } from "express-session";
import { ApiError } from "middleware/errors";
import verifyGoogleIdToken from "services/auth/google";
import getCookiesObjFromString from "utils/getCookies";
import { COOKIE_NONCE_ID_KEY } from "../nonce/controller";
import { getNonceFromDb, removeNonceFromDb } from "../nonce/saveNonce";

type ProcessedResult =
  | { success: true; userData: SessionData["userData"] }
  | { success: false; error: ApiError | Error };

function processAnonUser(
  name: string,
  sessionId: Request["sessionID"]
): ProcessedResult {
  const userData = {
    userId: sessionId,
    username: name,
    verified: false,
  };
  return { success: true, userData };
}

async function processGoogleUser(
  idToken: Parameters<typeof verifyGoogleIdToken>[0]["idToken"],
  cookieString: Parameters<typeof getCookiesObjFromString>[0]
): Promise<ProcessedResult> {
  const cookiesObj = getCookiesObjFromString(cookieString);
  const nonceId = cookiesObj[COOKIE_NONCE_ID_KEY];
  if (!nonceId) {
    const error = new ApiError(400, "Request nonce before attempting login");
    return { success: false, error };
  }

  const nonceGetResult = await getNonceFromDb(nonceId);
  if (!nonceGetResult.success) {
    const error = new ApiError(400, "Denied due to suspected replay attack");
    return { success: false, error };
  }

  const verificationResult = await verifyGoogleIdToken({
    idToken,
    nonce: nonceGetResult.nonce,
  });
  if (!verificationResult.success)
    return { success: false, error: verificationResult.error };

  await removeNonceFromDb(nonceId);
  return { success: true, userData: verificationResult.userData };
}

export { processAnonUser, processGoogleUser };
