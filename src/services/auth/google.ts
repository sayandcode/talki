import { Nonce, NONCE_HEX_LENGTH } from "controllers/auth/nonce/generateNonce";
import { SessionData } from "express-session";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import APP_ENV_VARS from "utils/setup/env";
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

// this helps us confirm that the defined schema matches the TokenPayload from Google's library
type PayloadSchemaType = z.infer<typeof PayloadSchema>;
type RequiredPayloadSubset = Pick<TokenPayload, keyof PayloadSchemaType>;

/**
 * @returns UserData if the verification was a success. Null otherwise.
 */
async function verifyGoogleIdToken({
  idToken,
  nonce: requiredNonce,
}: {
  idToken: string;
  nonce: Nonce;
}): Promise<SessionData["userData"] | null> {
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  const parseResult = PayloadSchema.safeParse(payload);

  if (!parseResult.success) {
    const errReason = fromZodError(parseResult.error);
    const errMsg = `Couldn't get payload from google oauth ticket.\n${errReason}`;
    throw new Error(errMsg);
  }

  const verifiedPayload = parseResult.data satisfies RequiredPayloadSubset;
  if (verifiedPayload.nonce !== requiredNonce) return null;

  return {
    userId: verifiedPayload.sub,
    username: verifiedPayload.name,
    verified: verifiedPayload.email_verified,
  };
}

export default verifyGoogleIdToken;
