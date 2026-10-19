# 簡易小投票器

學生專題：讓參與者為「今天午餐要吃什麼？」投票，可選「便當」、「麵」或「沙拉」，並查看目前票數。

## 開發方式

本專題使用 Spec Kit 協助整理需求與規劃開發流程，依需求狀況經過需求規格（Specify）、需求釐清（Clarify）、技術規劃（Plan）、任務拆解（Tasks）、一致性分析（Analyze）、分階段實作（Implement）及完成度收斂（Converge），並透過測試驗證成果。相關規格與規劃文件保存在 `specs/`。Spec Kit 是協助需求管理與開發流程的工具，不是投票器執行所需的應用程式框架。

## 前置條件

- Windows 10/11、macOS 或 Linux。
- Node.js **22.13 或更新版本**。Windows 使用者可從 [Node.js 官網](https://nodejs.org/en/download)下載 LTS 安裝程式；安裝時保留加入 `PATH` 的選項。
- pnpm **11.25.0**。Windows CMD 可用 npm 安裝：

  ```cmd
  npm install --global pnpm@11.25.0
  ```

安裝完成後，關閉並重新開啟終端機，確認指令可用：

```cmd
node --version
npm --version
pnpm --version
```

若 CMD 顯示找不到 `node` 或 `pnpm`，請確認安裝完成並重新開啟 CMD，讓新的 `PATH` 設定生效。

## 啟動開發環境（Windows CMD）

在 CMD 切換到專案根目錄：

```cmd
cd /d "%USERPROFILE%\Desktop\speckit-voting"
pnpm install
pnpm dev
```

等待 Vite 顯示本機網址，通常是 `http://127.0.0.1:5173/`，再用瀏覽器開啟。開發模式同時啟動前端和 API；API 預設使用 3001 埠。按 `Ctrl+C` 停止服務。

其他終端機可使用：

```cmd
pnpm test -- --run
pnpm typecheck
pnpm build
```

## 正式模式

先建立前端正式版，再啟動 API 與靜態頁面伺服器：

```cmd
pnpm build
pnpm start
```

預設服務埠為 `3001`，瀏覽器開啟 `http://127.0.0.1:3001/`。可用環境變數調整服務埠或 SQLite 資料庫位置：

```cmd
set "PORT=3100"
set "DATABASE_PATH=C:\poll-data\poll.sqlite"
pnpm start
```

若設定 `DATABASE_PATH`，請先確認其資料夾存在且執行服務的帳號有寫入權限。未設定時，資料庫預設儲存在專案工作目錄下的 `data\poll.sqlite`。此資料夾和 SQLite 檔案已由 `.gitignore` 排除，不應提交投票資料。

## 功能與限制

- 投票問題與選項固定為「今天午餐要吃什麼？」、「便當」、「麵」、「沙拉」；目前不能建立投票或編輯選項。
- 每次送出有效投票會為所選選項增加一票。系統沒有登入、身分識別或防止同一人重複投票的功能。
- 系統只保存各選項的累計票數，不保存個別投票紀錄或時間戳記。舊版資料庫初始化時會保留便當與麵的既有票數，並新增沙拉的零票紀錄。
- 投票成功後，送出者會立即看到最新票數；其他已開啟的頁面不會即時推播更新，重新整理頁面可取得目前結果。
- SQLite 檔案需要持續保留並可寫入；刪除資料庫檔案會失去累計票數。此專題以單一應用程式主機為使用範圍，未設計多主機部署或高可用資料同步。
- 專案不需要 API 金鑰或其他機敏設定。若日後加入機敏值，應透過環境變數或核准的祕密管理工具提供，不要寫入程式碼、設定檔或日誌。

## API

- `GET /api/poll`：取得問題、三個選項及目前票數。
- `POST /api/poll/votes`：送出 JSON，例如 `{"choiceId":"salad"}`。有效選項 ID 為 `bento`、`noodles`、`salad`；未選擇或無效選項會收到錯誤回應，且不會計票。
