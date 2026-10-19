// @vitest-environment node
import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";
import { initializeDatabase } from "../../server/src/storage/database";

describe("legacy poll database migration", () => {
  let database: Database.Database | undefined;

  afterEach(() => {
    database?.close();
    database = undefined;
  });

  it("preserves existing tallies, adds salad at zero, and is repeatable", () => {
    database = new Database(":memory:");
    database.exec(`
      CREATE TABLE poll_tallies (
        choice_id TEXT PRIMARY KEY CHECK (choice_id IN ('bento', 'noodles')),
        vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0)
      ) STRICT;
      INSERT INTO poll_tallies (choice_id, vote_count) VALUES ('bento', 7), ('noodles', 4);
    `);

    initializeDatabase(database);
    const expected = [
      { choice_id: "bento", vote_count: 7 },
      { choice_id: "noodles", vote_count: 4 },
      { choice_id: "salad", vote_count: 0 },
    ];
    const getRows = () =>
      database!.prepare("SELECT choice_id, vote_count FROM poll_tallies ORDER BY choice_id").all();

    expect(getRows()).toEqual(expected);
    expect(() =>
      database!.prepare("INSERT INTO poll_tallies (choice_id, vote_count) VALUES ('rice', 1)").run(),
    ).toThrow();
    expect(() =>
      database!.prepare("UPDATE poll_tallies SET vote_count = -1 WHERE choice_id = 'salad'").run(),
    ).toThrow();

    initializeDatabase(database);
    expect(getRows()).toEqual(expected);
  });
});
