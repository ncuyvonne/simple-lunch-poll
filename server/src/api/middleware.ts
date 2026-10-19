import type { ErrorRequestHandler } from "express";
import type { PollErrorCode, PollErrorResponse } from "../../../shared/poll-contracts";

function errorResponse(code: PollErrorCode, message: string): PollErrorResponse {
  return { error: { code, message } };
}

export const apiErrorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const parserError = error as { type?: string };
  if (parserError.type === "entity.parse.failed") {
    response.status(400).json(errorResponse("INVALID_JSON", "請確認送出的資料格式正確。"));
    return;
  }
  if (parserError.type === "entity.too.large") {
    response.status(413).json(errorResponse("REQUEST_TOO_LARGE", "送出的資料超過允許大小。"));
    return;
  }

  console.error("API request failed", { method: request.method, path: request.path });
  response.status(500).json(errorResponse("INTERNAL_ERROR", "系統發生錯誤，請稍後再試。"));
};
