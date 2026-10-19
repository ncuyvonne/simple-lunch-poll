// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import type { Server } from "node:http";
import { createApp } from "../../server/src/app";
import { createTestDatabase } from "./database";

describe("aggregate tally database foundation", () => {
  let database: Database.Database | undefined;
  let server: Server | undefined;

  afterEach(async () => {
    if (server?.listening) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => (error ? reject(error) : resolve()));
      });
    }
    database?.close();
    database = undefined;
    server = undefined;
  });

  it("initializes exactly three zeroed aggregate counts", () => {
    database = createTestDatabase();
    const rows = database
      .prepare("SELECT choice_id, vote_count FROM poll_tallies ORDER BY choice_id")
      .all();

    expect(rows).toEqual([
      { choice_id: "bento", vote_count: 0 },
      { choice_id: "noodles", vote_count: 0 },
      { choice_id: "salad", vote_count: 0 },
    ]);
    expect(database.prepare("PRAGMA table_info(poll_tallies)").all()).toHaveLength(2);
  });

  it("rejects unsupported choices and negative counts", () => {
    database = createTestDatabase();

    expect(() =>
      database!.prepare("INSERT INTO poll_tallies (choice_id, vote_count) VALUES (?, 1)").run("rice"),
    ).toThrow();
    expect(() =>
      database!.prepare("UPDATE poll_tallies SET vote_count = -1 WHERE choice_id = 'bento'").run(),
    ).toThrow();
    expect(
      database.prepare("SELECT choice_id, vote_count FROM poll_tallies ORDER BY choice_id").all(),
    ).toEqual([
      { choice_id: "bento", vote_count: 0 },
      { choice_id: "noodles", vote_count: 0 },
      { choice_id: "salad", vote_count: 0 },
    ]);
  });

  it("returns a clear error for malformed JSON before any tally can change", async () => {
    database = createTestDatabase();
    server = createApp(database).listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server!.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not bind a port.");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/poll/votes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: "INVALID_JSON",
        message: "請確認送出的資料格式正確。",
      },
    });
    expect(
      database.prepare("SELECT SUM(vote_count) AS total FROM poll_tallies").get(),
    ).toEqual({ total: 0 });
  });
});
