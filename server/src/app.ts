import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type Database from "better-sqlite3";
import { apiErrorHandler } from "./api/middleware";
import { createPollRouter } from "./api/poll-routes";

export function createApp(database: Database.Database) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "4kb" }));
  app.use("/api", createPollRouter(database));
  const clientBuildPath = resolve(process.cwd(), "dist");
  const clientIndexPath = resolve(clientBuildPath, "index.html");
  if (existsSync(clientIndexPath)) {
    app.use(express.static(clientBuildPath));
    app.use((request, response, next) => {
      if (request.method !== "GET" || request.path.startsWith("/api/")) {
        next();
        return;
      }
      response.sendFile(clientIndexPath);
    });
  }
  app.use(apiErrorHandler);
  return app;
}
