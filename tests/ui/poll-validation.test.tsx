// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import PollPage from "../../src/features/poll/PollPage";

const initialPoll = {
  id: "lunch-poll",
  question: "今天午餐要吃什麼？",
  choices: [
    { id: "bento", label: "便當", voteCount: 0 },
    { id: "noodles", label: "麵", voteCount: 0 },
    { id: "salad", label: "沙拉", voteCount: 0 },
  ],
};

const votedPoll = {
  ...initialPoll,
  choices: [
    { id: "bento", label: "便當", voteCount: 1 },
    { id: "noodles", label: "麵", voteCount: 0 },
    { id: "salad", label: "沙拉", voteCount: 0 },
  ],
};

describe("poll input validation", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("rejects an empty submission without sending it and clears the error on recovery", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => initialPoll })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ accepted: true, poll: votedPoll }) });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<PollPage />);
    await screen.findByRole("radio", { name: /^便當/ });

    await user.click(screen.getByRole("button", { name: "送出投票" }));

    const emptyError = await screen.findByRole("alert");
    expect(emptyError.textContent).toContain("請先選擇一個選項再送出。");
    expect(emptyError.getAttribute("aria-live")).toBe("assertive");
    expect(screen.getByText("便當：0 票")).toBeTruthy();
    expect(screen.getByText("麵：0 票")).toBeTruthy();
    expect(screen.getByText("沙拉：0 票")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("radio", { name: /^便當/ }));
    expect(screen.queryByRole("alert")).toBeNull();
    await user.click(screen.getByRole("button", { name: "送出投票" }));

    expect(await screen.findByText("便當：1 票")).toBeTruthy();
    expect(screen.getByText("麵：0 票")).toBeTruthy();
    expect(screen.getByText("沙拉：0 票")).toBeTruthy();
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
