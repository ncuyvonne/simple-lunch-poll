// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PollPage from "../../src/features/poll/PollPage";

const poll = {
  id: "lunch-poll",
  question: "今天午餐要吃什麼？",
  choices: [
    { id: "bento", label: "便當", voteCount: 0 },
    { id: "noodles", label: "麵", voteCount: 0 },
    { id: "salad", label: "沙拉", voteCount: 0 },
  ],
};

describe("poll loading states", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("communicates loading and shows poll counts after the request succeeds", async () => {
    let resolvePoll!: (response: { ok: boolean; json: () => Promise<typeof poll> }) => void;
    const fetchMock = vi.fn(() => new Promise<{ ok: boolean; json: () => Promise<typeof poll> }>((resolve) => {
      resolvePoll = resolve;
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(<PollPage />);

    expect(screen.getByText("正在載入投票…")).toBeTruthy();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.getByRole("button", { name: "送出投票" }).hasAttribute("disabled")).toBe(true);

    resolvePoll({ ok: true, json: async () => poll });

    expect(await screen.findByRole("radio", { name: /^便當/ })).toBeTruthy();
    expect(screen.getByText("便當：0 票")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows an actionable failure and no fabricated choices or vote counts", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("目前無法載入投票，請稍後再試。"));
    vi.stubGlobal("fetch", fetchMock);

    render(<PollPage />);

    expect((await screen.findByRole("alert")).textContent).toContain("目前無法載入投票，請稍後再試。");
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.queryByText(/\d+ 票/)).toBeNull();
    expect(screen.getByRole("button", { name: "送出投票" }).hasAttribute("disabled")).toBe(true);
  });
});
