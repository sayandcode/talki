import ServerlessHttp from "serverless-http";
import makeApp from "@appLambda/app";
import DatabaseClients from "@appLambda/services/db";
import { APIGatewayProxyWebsocketHandlerV2 as Handler } from "aws-lambda";

const databaseClients = new DatabaseClients();

// eslint-disable-next-line import/prefer-default-export
export const handler: Handler = (event, context) => {
  const app = makeApp(databaseClients);
  const serverlessInstance = ServerlessHttp(app);
  return serverlessInstance(event, context);
};
