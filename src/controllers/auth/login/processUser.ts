import { Request } from "express";
import { SessionData } from "express-session";
import { ApiError } from "middleware/errors";
import verifyGoogleIdToken from "services/auth/google";

type ProcessedResult =
  | { success: true; userData: SessionData["userData"] }
  | { success: false; error: any };

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
  nonce: Request["session"]["nonce"]
): Promise<ProcessedResult> {
  if (!nonce) {
    const error = new ApiError(400, "Denied due to suspected replay attack");
    return { success: false, error };
  }

  const verificationResult = await verifyGoogleIdToken({ idToken, nonce });
  if (!verificationResult.success)
    return { success: false, error: verificationResult.error };
  return { success: true, userData: verificationResult.userData };
}

export { processAnonUser, processGoogleUser };
