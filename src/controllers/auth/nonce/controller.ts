import APP_ENV_VARS from "utils/setup/env";
import makeAsyncController from "utils/reqRes/asyncController";
import DatabaseClients from "services/db";
import generateNonce from "./generateNonce";
import { setNonceInDb } from "./saveNonce";

const { BACKEND_URL, FRONTEND_URL } = APP_ENV_VARS;

const NONCE_TIMEOUT = 1000 * 60 * 2; // 2 min
const COOKIE_NONCE_ID_KEY = "nonceId";

function makeAuthNonceController(databaseClients: DatabaseClients) {
  return makeAsyncController(async (_, res) => {
    const { nonceId, nonce } = generateNonce();

    await setNonceInDb({
      nonceId,
      nonce,
      maxAge: NONCE_TIMEOUT,
      redisClient: databaseClients.redisClient,
    });
    res.cookie(COOKIE_NONCE_ID_KEY, nonceId, {
      httpOnly: true,
      maxAge: NONCE_TIMEOUT,
      secure: [FRONTEND_URL, BACKEND_URL].every((url) =>
        url.startsWith("https:")
      ), // set to true when hosted on https
    });

    res.status(200).json({ nonce });
  });
}

export default makeAuthNonceController;
export { COOKIE_NONCE_ID_KEY };
