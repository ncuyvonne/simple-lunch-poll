import type { Server } from "node:http";
import type Database from "better-sqlite3";
import { createApp } from "../../server/src/app";

export interface TestServer {
  baseUrl: string;
  close(): Promise<void>;
}

export async function startTestServer(database: Database.Database): Promise<TestServer> {
  const server: Server = createApp(database).listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Test server did not bind a port.");
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
  };
}
