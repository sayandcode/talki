import makeApp from "app";
import DatabaseClients from "services/db";

const databaseClients = new DatabaseClients();

const app = makeApp(databaseClients);

// eslint-disable-next-line no-console
app.listen(8080, () => console.log("listening on 8080"));
