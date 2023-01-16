import { resumeUserJourney } from "scripts/pages/login";
import authLoginEndpoint, {
  AuthLoginEndpoint,
} from "utils/endpoints/auth/login";
import authNonceEndpoint, {
  AuthNonceEndpoint,
} from "utils/endpoints/auth/nonce";
import backendFetch from "utils/functions/backendFetch";
import toggleError from "./errors";

async function getNonce() {
  const { url, method } = authNonceEndpoint;
  const response = await backendFetch(url, { method });
  const { nonce } = (await response.json()) as AuthNonceEndpoint["response"];
  return nonce;
}

type GoogleSignInCallbackArgs = {
  clientId: string;
  credential: string;
};

function processGoogleToken({ credential: idToken }: GoogleSignInCallbackArgs) {
  toggleError(false);
  sendTokenToBackend(idToken)
    .then(resumeUserJourney)
    .catch(() => toggleError(true, "Couldn't log in. Try again."));
}

function sendTokenToBackend(idToken: string) {
  const reqBodyObj: AuthLoginEndpoint["body"] = { type: "google", idToken };
  const { url, method, headers } = authLoginEndpoint;
  const body = JSON.stringify(reqBodyObj);
  return backendFetch(url, { method, body, headers });
}

export { getNonce, processGoogleToken };
