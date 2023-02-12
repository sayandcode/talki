import ServerlessHttp from "serverless-http";
import makeApp from "app";
import DatabaseClients from "services/db";

const databaseClients = new DatabaseClients();

// eslint-disable-next-line import/prefer-default-export
export const handler = (event: Object, context: Object) => {
  const app = makeApp(databaseClients);
  const serverlessInstance = ServerlessHttp(app);
  return serverlessInstance(event, context);
};
