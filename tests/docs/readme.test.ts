import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync("README.md", "utf8");
const developmentHeading = "## 開發方式";
const prerequisitesHeading = "## 前置條件";

describe("project README development documentation", () => {
  it("describes the Spec Kit workflow before prerequisites without calling it the app framework", () => {
    const developmentStart = readme.indexOf(developmentHeading);
    const prerequisitesStart = readme.indexOf(prerequisitesHeading);

    expect(developmentStart).toBeGreaterThan(-1);
    expect(prerequisitesStart).toBeGreaterThan(developmentStart);

    const developmentSection = readme.slice(developmentStart, prerequisitesStart);
    for (const stage of ["Spec Kit", "Specify", "Clarify", "Plan", "Tasks", "Analyze", "Implement", "Converge", "驗證"]) {
      expect(developmentSection).toContain(stage);
    }
    expect(developmentSection).toContain("不是投票器執行所需的應用程式框架");
  });

  it("retains the existing project, startup, limitations, and API sections", () => {
    for (const heading of [
      "# 簡易小投票器",
      prerequisitesHeading,
      "## 啟動開發環境（Windows CMD）",
      "## 正式模式",
      "## 功能與限制",
      "## API",
    ]) {
      expect(readme).toContain(heading);
    }
  });
});
