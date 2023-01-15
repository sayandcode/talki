import { Nonce, NONCE_HEX_LENGTH } from "controllers/auth/nonce/generateNonce";
import { SessionData } from "express-session";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ApiError } from "middleware/errors";
import APP_ENV_VARS from "utils/setupEnv";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const clientId = APP_ENV_VARS.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

const PayloadSchema = z.object({
  sub: z.string(),
  name: z.string(),
  nonce: z.string().length(NONCE_HEX_LENGTH),
  email_verified: z.boolean(),
});

type AwaitedReturnValue =
  | { success: true; userData: SessionData["userData"] }
  | { success: false; error: ApiError | Error };

async function verifyGoogleIdToken({
  idToken,
  nonce: requiredNonce,
}: {
  idToken: string;
  nonce: Nonce;
}): Promise<AwaitedReturnValue> {
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  const parseResult = PayloadSchema.safeParse(payload);

  if (!parseResult.success) {
    const errReason = fromZodError(parseResult.error);
    const errMsg = `Couldn't get payload from google oauth ticket.\n${errReason}`;
    return { success: false, error: new Error(errMsg) };
  }

  // this helps us confirm that the defined schema matches the TokenPayload from Google's library
  type PayloadSchemaType = z.infer<typeof PayloadSchema>;
  type RequiredPayloadSubset = Pick<TokenPayload, keyof PayloadSchemaType>;
  const verifiedPayload = parseResult.data satisfies RequiredPayloadSubset;

  if (verifiedPayload.nonce !== requiredNonce) {
    const error = new ApiError(400, "Denied due to suspected replay attack");
    return { success: false, error };
  }

  const userData = {
    userId: verifiedPayload.sub,
    username: verifiedPayload.name,
    verified: verifiedPayload.email_verified,
  };
  return { success: true, userData };
}

export default verifyGoogleIdToken;
