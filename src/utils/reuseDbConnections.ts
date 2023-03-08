import { Context } from "aws-lambda";
import { Connection as MongooseConnection } from "mongoose";

async function reuseDbConnections(
  context: Context,
  mongoClient: MongooseConnection
) {
  // reuse client between connections
  context.callbackWaitsForEmptyEventLoop = false;
  await mongoClient.asPromise();
}

export default reuseDbConnections;
