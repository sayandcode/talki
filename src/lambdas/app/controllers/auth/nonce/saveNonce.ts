import { Redis } from "ioredis";
import { Nonce, NonceId } from "@utils/generateNonce";

type SetNonceOptionsObj = {
  nonceId: NonceId;
  maxAge: number;
  nonce: Nonce;
  redisClient: Redis;
};

function setNonceInDb({
  nonceId,
  maxAge,
  nonce,
  redisClient,
}: SetNonceOptionsObj) {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const ttl = maxAge / 1000; // millisecond -> second
  return redisClient.setex(keyInRedis, ttl, nonce);
}

async function getNonceFromDb(
  nonceId: NonceId,
  redisClient: Redis
): Promise<Nonce | null> {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const nonce = await redisClient.get(keyInRedis);
  return nonce;
}

async function removeNonceFromDb(nonceId: NonceId, redisClient: Redis) {
  const keyInRedis = getNonceKeyInRedis(nonceId);
  const resultNum = await redisClient.del(keyInRedis);
  if (resultNum === 0) throw new Error("No such key");
}

function getNonceKeyInRedis(nonceId: NonceId) {
  return `nonceId:${nonceId}`;
}

export { setNonceInDb, getNonceFromDb, removeNonceFromDb };
