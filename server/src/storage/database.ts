import Database from "better-sqlite3";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const schemaPath = new URL("./schema.sql", import.meta.url);

function migrateLegacyPollTallies(database: Database.Database): void {
  const table = database
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'poll_tallies'")
    .get() as { sql: string } | undefined;

  if (!table || /'salad'/i.test(table.sql)) return;

  database.transaction(() => {
    database.exec(`
      ALTER TABLE poll_tallies RENAME TO poll_tallies_legacy;
      CREATE TABLE poll_tallies (
        choice_id TEXT PRIMARY KEY CHECK (choice_id IN ('bento', 'noodles', 'salad')),
        vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0)
      ) STRICT;
      INSERT INTO poll_tallies (choice_id, vote_count)
        SELECT choice_id, vote_count FROM poll_tallies_legacy;
      INSERT INTO poll_tallies (choice_id, vote_count) VALUES ('salad', 0);
      DROP TABLE poll_tallies_legacy;
    `);
  })();
}

export function initializeDatabase(database: Database.Database): void {
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  migrateLegacyPollTallies(database);
  database.exec(readFileSync(schemaPath, "utf8"));
}

export function openDatabase(databasePath: string): Database.Database {
  if (databasePath !== ":memory:") {
    const absolutePath = resolve(databasePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    databasePath = absolutePath;
  }

  const database = new Database(databasePath);
  initializeDatabase(database);
  return database;
}
