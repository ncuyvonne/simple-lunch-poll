CREATE TABLE IF NOT EXISTS poll_tallies (
  choice_id TEXT PRIMARY KEY CHECK (choice_id IN ('bento', 'noodles', 'salad')),
  vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0)
) STRICT;

INSERT OR IGNORE INTO poll_tallies (choice_id, vote_count) VALUES ('bento', 0);
INSERT OR IGNORE INTO poll_tallies (choice_id, vote_count) VALUES ('noodles', 0);
INSERT OR IGNORE INTO poll_tallies (choice_id, vote_count) VALUES ('salad', 0);
