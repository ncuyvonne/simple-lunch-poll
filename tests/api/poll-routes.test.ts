// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createTestDatabase } from "../setup/database";
import { startTestServer, type TestServer } from "../helpers/http";

describe("poll API contract", () => {
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

  it("returns the fixed poll with zero totals", async () => {
    const response = await fetch(`${server.baseUrl}/api/poll`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: "lunch-poll",
      question: "今天午餐要吃什麼？",
      choices: [
        { id: "bento", label: "便當", voteCount: 0 },
        { id: "noodles", label: "麵", voteCount: 0 },
        { id: "salad", label: "沙拉", voteCount: 0 },
      ],
    });
  });

  it.each([
    ["bento", 1, 0, 0],
    ["noodles", 0, 1, 0],
    ["salad", 0, 0, 1],
  ])("accepts one vote for %s and returns all current totals", async (choiceId, bentoCount, noodlesCount, saladCount) => {
    const response = await fetch(`${server.baseUrl}/api/poll/votes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choiceId }),
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      accepted: true,
      poll: {
        id: "lunch-poll",
        question: "今天午餐要吃什麼？",
        choices: [
          { id: "bento", label: "便當", voteCount: bentoCount },
          { id: "noodles", label: "麵", voteCount: noodlesCount },
          { id: "salad", label: "沙拉", voteCount: saladCount },
        ],
      },
    });
  });
});
