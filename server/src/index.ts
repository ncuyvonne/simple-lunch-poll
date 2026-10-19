import { createApp } from "./app";
import { loadConfig } from "./config";
import { openDatabase } from "./storage/database";

const config = loadConfig();
const database = openDatabase(config.databasePath);
const app = createApp(database);

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`Poll API listening on port ${config.port}`);
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
