import APP_ENV_VARS from "utils/setupEnv";
import makeAsyncController from "utils/asyncController";
import generateNonce from "./generateNonce";
import { setNonceInDb } from "./saveNonce";

const { BACKEND_URL, FRONTEND_URL } = APP_ENV_VARS;

const NONCE_TIMEOUT = 1000 * 60 * 2; // 2 min
const COOKIE_NONCE_ID_KEY = "nonceId";

const authNonceController = makeAsyncController(async (_, res) => {
  const { nonceId, nonce } = generateNonce();

  await setNonceInDb({ nonceId, nonce, maxAge: NONCE_TIMEOUT });
  res.cookie(COOKIE_NONCE_ID_KEY, nonceId, {
    httpOnly: true,
    maxAge: NONCE_TIMEOUT,
    secure: [FRONTEND_URL, BACKEND_URL].every((url) =>
      url.startsWith("https:")
    ), // set to true when hosted on https
  });

  res.status(200).json({ nonce });
});

export default authNonceController;
export { COOKIE_NONCE_ID_KEY };
