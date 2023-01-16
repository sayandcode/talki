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

async function getNonceFromDb(nonceId: NonceId): Promise<Nonce | null> {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const nonce = await redisClient.get(keyInRedis);
  return nonce;
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
