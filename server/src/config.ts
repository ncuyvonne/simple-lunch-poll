import { resolve } from "node:path";

export interface AppConfig {
  port: number;
  databasePath: string;
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const rawPort = environment.PORT?.trim();
  let port = 3001;

  if (rawPort) {
    if (!/^\d+$/.test(rawPort)) {
      throw new Error("PORT must be an integer between 1 and 65535.");
    }
    port = Number(rawPort);
    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
      throw new Error("PORT must be an integer between 1 and 65535.");
    }
  }

  const rawDatabasePath = environment.DATABASE_PATH?.trim();
  if (environment.DATABASE_PATH !== undefined && !rawDatabasePath) {
    throw new Error("DATABASE_PATH must be a non-empty file path.");
  }

  return {
    port,
    databasePath: resolve(rawDatabasePath || "data/poll.sqlite"),
  };
}
