import makeAsyncController from "@appLambda/utils/reqRes/asyncController";
import DatabaseClients from "@appLambda/services/db";
import generateNonce from "@utils/generateNonce";
import { setNonceInDb } from "./saveNonce";

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
      secure: true, // set to true when hosted on https
      sameSite: 'none'
    });

    res.status(200).json({ nonce });
  });
}

export default makeAuthNonceController;
export { COOKIE_NONCE_ID_KEY };
