import { useEffect, useState, type FormEvent } from "react";
import type { ChoiceId, PollResponse } from "../../../shared/poll-contracts";
import { fetchPoll, submitVote } from "./poll-api";
import "./poll-page.css";

export default function PollPage() {
  const [poll, setPoll] = useState<PollResponse | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceId | "">("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPoll()
      .then((result) => {
        if (active) setPoll(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "目前無法載入投票，請稍後再試。");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!selectedChoice) {
      setStatus("");
      setError("請先選擇一個選項再送出。");
      return;
    }

    setError("");
    setStatus("");
    setIsSubmitting(true);
    try {
      const result = await submitVote({ choiceId: selectedChoice });
      setPoll(result.poll);
      setStatus("投票成功，票數已更新。");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "目前無法送出投票，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="poll-page min-h-screen px-5 py-12 sm:px-8 sm:py-20">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <section className="poll-card w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_28px_80px_-36px_rgba(67,51,30,0.35)] backdrop-blur">
          <div className="bg-[#263b32] px-8 pb-9 pt-10 text-white sm:px-12 sm:pt-12">
            <p className="mb-4 text-sm font-semibold tracking-[0.22em] text-[#d9bd8c]">TODAY’S TABLE</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">今天午餐要吃什麼？</h1>
            <p className="mt-3 text-sm text-white/70">選一個你最想吃的，看看大家的選擇。</p>
          </div>

          <form className="space-y-7 px-6 py-8 sm:px-12 sm:py-10" onSubmit={handleSubmit}>
            {isLoading ? (
              <p className="py-6 text-center text-sm text-slate-500">正在載入投票…</p>
            ) : poll ? (
              <fieldset disabled={isSubmitting} className="space-y-3">
                <legend className="mb-4 text-sm font-semibold text-slate-600">請選擇一個選項</legend>
                {poll.choices.map((choice) => (
                  <label
                    key={choice.id}
                    className={`poll-choice flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 transition ${
                      selectedChoice === choice.id
                        ? "border-[#557765] bg-[#f0f5f1] ring-2 ring-[#557765]/15"
                        : "border-slate-200 bg-white hover:border-[#a6b8aa] hover:bg-[#fafbf9]"
                    }`}
                  >
                    <span className="poll-choice-label flex min-w-0 items-center gap-3 sm:gap-4">
                      <input
                        className="h-5 w-5 shrink-0 accent-[#557765]"
                        type="radio"
                        name="choice"
                        value={choice.id}
                        checked={selectedChoice === choice.id}
                        onChange={() => {
                          setSelectedChoice(choice.id);
                          setError("");
                        }}
                      />
                      <span className="text-lg font-semibold text-slate-800">{choice.label}</span>
                    </span>
                    <span className="poll-choice-count text-sm tabular-nums text-slate-500">
                      {choice.label}：{choice.voteCount} 票
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : null}

            {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert" aria-live="assertive" aria-atomic="true">{error}</p>}
            {status && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status" aria-live="polite" aria-atomic="true">{status}</p>}

            <button
              className="w-full rounded-xl bg-[#263b32] px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-[#344e42] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#557765] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isLoading || !poll || isSubmitting}
            >
              {isSubmitting ? "送出中…" : "送出投票"}
            </button>
          </form>

          <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5 text-xs text-slate-400 sm:px-12">
            <span>每次送出計一票</span>
            <span>投票後立即更新</span>
          </div>
        </section>
      </div>
    </main>
  );
}
