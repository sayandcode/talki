import redisClient from "services/db/redis";
import { Nonce, NonceId } from "./generateNonce";

type SetNonceOptionsObj = {
  nonceId: NonceId;
  maxAge: number;
  nonce: Nonce;
};

function setNonceInDb({ nonceId, maxAge, nonce }: SetNonceOptionsObj) {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const ttl = maxAge / 1000; // millisecond -> second
  return redisClient.setex(keyInRedis, ttl, nonce);
}

type AwaitedGetNonceReturnType =
  | {
      success: true;
      nonce: Nonce;
    }
  | { success: false; error: Error };

async function getNonceFromDb(
  nonceId: NonceId
): Promise<AwaitedGetNonceReturnType> {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const nonce = await redisClient.get(keyInRedis);
  if (!nonce) return { success: false, error: new Error("No nonce found") };
  return { success: true, nonce };
}

async function removeNonceFromDb(nonceId: NonceId) {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const resultNum = await redisClient.del(keyInRedis);
  if (resultNum === 0) throw new Error("No such key");
}

function getNonceKeyInRedis(nonceId: NonceId) {
  return `nonceId:${nonceId}`;
}

export { setNonceInDb, getNonceFromDb, removeNonceFromDb };
