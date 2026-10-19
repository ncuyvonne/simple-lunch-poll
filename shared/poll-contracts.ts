export const POLL_ID = "lunch-poll" as const;

export const CHOICES = [
  { id: "bento", label: "便當" },
  { id: "noodles", label: "麵" },
  { id: "salad", label: "沙拉" },
] as const;

export type ChoiceId = (typeof CHOICES)[number]["id"];

export interface PollChoice {
  id: ChoiceId;
  label: string;
  voteCount: number;
}

export interface PollResponse {
  id: typeof POLL_ID;
  question: "今天午餐要吃什麼？";
  choices: PollChoice[];
}

export interface VoteRequest {
  choiceId: string;
}

export interface VoteResponse {
  accepted: true;
  poll: PollResponse;
}

export type PollErrorCode =
  | "NO_CHOICE_SELECTED"
  | "INVALID_CHOICE"
  | "INVALID_JSON"
  | "REQUEST_TOO_LARGE"
  | "INTERNAL_ERROR";

export interface PollErrorResponse {
  error: {
    code: PollErrorCode;
    message: string;
  };
}
