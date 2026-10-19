import type {
  PollErrorResponse,
  PollResponse,
  VoteRequest,
  VoteResponse,
} from "../../../shared/poll-contracts";

export class PollApiError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = "PollApiError";
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new PollApiError("無法讀取伺服器回應，請稍後再試。", "INVALID_RESPONSE");
  }

  if (!response.ok) {
    const error = payload as Partial<PollErrorResponse>;
    throw new PollApiError(
      error.error?.message ?? "系統發生錯誤，請稍後再試。",
      error.error?.code ?? "INTERNAL_ERROR",
    );
  }

  return payload as T;
}

export async function fetchPoll(): Promise<PollResponse> {
  const response = await fetch("/api/poll");
  return readResponse<PollResponse>(response);
}

export async function submitVote(request: VoteRequest): Promise<VoteResponse> {
  const response = await fetch("/api/poll/votes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request),
  });
  return readResponse<VoteResponse>(response);
}
