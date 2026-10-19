// @vitest-environment node
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { openDatabase } from "../../server/src/storage/database";
import { startTestServer, type TestServer } from "../helpers/http";

describe("poll tally persistence", () => {
  let database: Database.Database | undefined;
  let server: TestServer | undefined;
  let directory: string | undefined;

  afterEach(async () => {
    if (server) await server.close();
    database?.close();
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  it("preserves only aggregate counts after reopening the database", async () => {
    directory = mkdtempSync(join(tmpdir(), "lunch-poll-test-"));
    const databasePath = join(directory, "poll.sqlite");
    database = openDatabase(databasePath);
    server = await startTestServer(database);

    const voteResponse = await fetch(`${server.baseUrl}/api/poll/votes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choiceId: "bento" }),
    });
    expect(voteResponse.status).toBe(201);
    const saladVoteResponse = await fetch(`${server.baseUrl}/api/poll/votes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choiceId: "salad" }),
    });
    expect(saladVoteResponse.status).toBe(201);

    await server.close();
    server = undefined;
    database.close();
    database = openDatabase(databasePath);
    server = await startTestServer(database);

    const pollResponse = await fetch(`${server.baseUrl}/api/poll`);
    expect(await pollResponse.json()).toEqual({
      id: "lunch-poll",
      question: "今天午餐要吃什麼？",
      choices: [
        { id: "bento", label: "便當", voteCount: 1 },
        { id: "noodles", label: "麵", voteCount: 0 },
        { id: "salad", label: "沙拉", voteCount: 1 },
      ],
    });
    expect(database.prepare("SELECT COUNT(*) AS count FROM poll_tallies").get()).toEqual({ count: 3 });
  });
});
