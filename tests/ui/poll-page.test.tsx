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
    { id: "bento", label: "便當", voteCount: 0 },
    { id: "noodles", label: "麵", voteCount: 0 },
    { id: "salad", label: "沙拉", voteCount: 1 },
  ],
};

describe("lunch poll page", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows the question, exactly three single-select choices, and updated totals after voting", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => initialPoll })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ accepted: true, poll: votedPoll }) });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<PollPage />);

    expect(await screen.findByRole("heading", { name: "今天午餐要吃什麼？" })).toBeTruthy();
    expect(screen.getByText("投票後立即更新")).toBeTruthy();
    const choices = screen.getAllByRole("radio");
    expect(choices).toHaveLength(3);
    expect(choices.map((choice) => (choice as HTMLInputElement).value)).toEqual(["bento", "noodles", "salad"]);

    await user.click(screen.getByRole("radio", { name: /^沙拉/ }));
    expect((screen.getByRole("radio", { name: /^沙拉/ }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getAllByRole("radio").filter((choice) => (choice as HTMLInputElement).checked)).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "送出投票" }));

    expect(await screen.findByText("便當：0 票")).toBeTruthy();
    expect(screen.getByText("麵：0 票")).toBeTruthy();
    expect(screen.getByText("沙拉：1 票")).toBeTruthy();
    expect((await screen.findByRole("status")).textContent).toContain("投票成功，票數已更新。");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ choiceId: "salad" }),
    });
  });
});
