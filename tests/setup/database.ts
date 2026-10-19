import Database from "better-sqlite3";
import { initializeDatabase } from "../../server/src/storage/database";

export function createTestDatabase(): Database.Database {
  const database = new Database(":memory:");
  initializeDatabase(database);
  return database;
}
