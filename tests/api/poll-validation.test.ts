// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createTestDatabase } from "../setup/database";
import { startTestServer, type TestServer } from "../helpers/http";

describe("poll API input validation", () => {
  let database: Database.Database;
  let server: TestServer;

  beforeEach(async () => {
    database = createTestDatabase();
    server = await startTestServer(database);
  });

  afterEach(async () => {
    await server.close();
    database.close();
  });

  it.each([
    ["missing choice", "{}", "NO_CHOICE_SELECTED", "請先選擇一個選項再送出。"],
    ["empty choice", '{"choiceId":""}', "NO_CHOICE_SELECTED", "請先選擇一個選項再送出。"],
    ["unknown choice", '{"choiceId":"rice"}', "INVALID_CHOICE", "請選擇有效的投票選項。"],
    ["wrong choice type", '{"choiceId":42}', "INVALID_CHOICE", "請選擇有效的投票選項。"],
    ["malformed JSON", "{", "INVALID_JSON", "請確認送出的資料格式正確。"],
  ])("rejects %s without changing any of the three tallies", async (_scenario, body, code, message) => {
    const response = await fetch(`${server.baseUrl}/api/poll/votes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code, message } });
    expect(
      database.prepare("SELECT choice_id, vote_count FROM poll_tallies ORDER BY choice_id").all(),
    ).toEqual([
      { choice_id: "bento", vote_count: 0 },
      { choice_id: "noodles", vote_count: 0 },
      { choice_id: "salad", vote_count: 0 },
    ]);
  });
});
