import { RequestHandler } from "express";
import crypto from "node:crypto";

const NONCE_HEX_LENGTH = 32;
const HEX_BYTE_LENGTH = 2;

declare module "express-session" {
  interface SessionData {
    nonce: string | null | undefined;
  }
}

const authNonceController: RequestHandler = (req, res) => {
  const nonce = crypto
    .randomBytes(NONCE_HEX_LENGTH / HEX_BYTE_LENGTH)
    .toString("hex");
  req.session.nonce = nonce;
  res.status(200).json({ nonce });
};

export default authNonceController;
export { NONCE_HEX_LENGTH };
