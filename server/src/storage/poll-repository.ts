import type Database from "better-sqlite3";
import { CHOICES, POLL_ID, type ChoiceId, type PollResponse } from "../../../shared/poll-contracts";

const tallyQuery = "SELECT choice_id, vote_count FROM poll_tallies WHERE choice_id = ?";

export function getPoll(database: Database.Database): PollResponse {
  const choices = CHOICES.map((choice) => {
    const tally = database.prepare(tallyQuery).get(choice.id) as
      | { choice_id: string; vote_count: number }
      | undefined;
    if (!tally) throw new Error("Poll tally is missing for a fixed choice.");
    return { ...choice, voteCount: tally.vote_count };
  });

  return { id: POLL_ID, question: "今天午餐要吃什麼？", choices: [...choices] };
}

export function incrementTally(database: Database.Database, choiceId: ChoiceId): PollResponse {
  return database.transaction(() => {
    const result = database
      .prepare("UPDATE poll_tallies SET vote_count = vote_count + 1 WHERE choice_id = ?")
      .run(choiceId);
    if (result.changes !== 1) throw new Error("Poll tally is missing for a fixed choice.");
    return getPoll(database);
  })();
}
