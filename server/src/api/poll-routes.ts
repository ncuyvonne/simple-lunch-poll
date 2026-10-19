import { Router, type Response } from "express";
import type Database from "better-sqlite3";
import { CHOICES, type ChoiceId, type PollErrorResponse } from "../../../shared/poll-contracts";
import { getPoll, incrementTally } from "../storage/poll-repository";

function sendError(
  response: Response,
  status: number,
  code: "NO_CHOICE_SELECTED" | "INVALID_CHOICE",
  message: string,
) {
  const body: PollErrorResponse = { error: { code, message } };
  return response.status(status).json(body);
}

export function createPollRouter(database: Database.Database) {
  const router = Router();

  router.get("/poll", (_request, response) => {
    response.json(getPoll(database));
  });

  router.post("/poll/votes", (request, response) => {
    const body: unknown = request.body;
    if (!body || typeof body !== "object" || !("choiceId" in body)) {
      return sendError(response, 400, "NO_CHOICE_SELECTED", "請先選擇一個選項再送出。");
    }

    const choiceId = (body as { choiceId?: unknown }).choiceId;
    if (choiceId === "" || choiceId === undefined || choiceId === null) {
      return sendError(response, 400, "NO_CHOICE_SELECTED", "請先選擇一個選項再送出。");
    }
    if (typeof choiceId !== "string" || !CHOICES.some((choice) => choice.id === choiceId)) {
      return sendError(response, 400, "INVALID_CHOICE", "請選擇有效的投票選項。");
    }

    const poll = incrementTally(database, choiceId as ChoiceId);
    return response.status(201).json({ accepted: true, poll });
  });

  return router;
}
