import crypto from "node:crypto";

type NonceId = string;
type Nonce = string;

const NONCE_HEX_LENGTH = 32;
const HEX_BYTE_LENGTH = 2;

function generateNonce() {
  const nonce: Nonce = crypto
    .randomBytes(NONCE_HEX_LENGTH / HEX_BYTE_LENGTH)
    .toString("hex");
  const nonceId: NonceId = crypto.randomUUID();
  return { nonceId, nonce };
}

export default generateNonce;
export { NONCE_HEX_LENGTH };
export type { NonceId, Nonce };
