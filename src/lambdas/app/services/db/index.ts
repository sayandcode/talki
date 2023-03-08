import { Redis } from "ioredis";
import { Connection as mongooseConnection } from "mongoose";
import getMongoClient from "./mongo";
import getRedisClient from "./redis";

class DatabaseClients {
  public readonly redisClient: Redis;

  public readonly mongoClient: mongooseConnection;

  constructor() {
    this.redisClient = getRedisClient();
    this.mongoClient = getMongoClient();
  }
}

export default DatabaseClients;
