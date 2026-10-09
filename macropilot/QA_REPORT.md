# MacroPilot MVP QA Report

## 対象と保護境界
- 対象ブランチ：`feature/macropilot-mvp`（`tamatamax-84/pwa-prototype-public` 内）。独立リポジトリではありません。
- Canonical OS：`tamatamax-84/AI-TEAM-NEXUS` / `main` / `OS/AI_TEAM_HQ_OS.md` を今回ロード・検証。`OS_NAME=AI TEAM HQ OS`、`VERSION=v3.0 Compact`、`STATUS=ACTIVE`、`CANONICAL=YES`。OSリポジトリへの書き込みは行っていません。
- `main` と `baseline/pwa-foundation-v1.0` の `index.html`、`app.js`、`manifest.json` は今回再取得し、両ブランチ間でSHAが一致していることを確認。既知の基盤SHAとも一致し、変更なし。

## CI・自動テスト結果
- **PASS**：GitHub Actions run [37965610481](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37965610481)、commit `9e10364485824176299609651b7061fe9c290d80`。状態 `completed`、結論 `success`。
- JavaScript syntax：PASS。
- `nutrition.test.js`：PASS。19 assertions（量に応じた栄養計算、合計、目標残量、食事追加・削除、日付切替、目標値検証、バックアップ検証）。
- `pwa.test.js`：PASS。スクリプト読込順、オフライン資産リスト、manifest、食品データ出典スキーマの静的検査。
- `official-foods.test.js`：PASS。公式食品データの出典・食品番号・食品状態・栄養値を検査するテスト（出力表示は16 assertions）。
- `browser.test.cjs`：PASS。Playwright Chromiumで、目標保存と再読み込み、食事追加・削除、日付切替、バックアップ書き出し・復元、不正バックアップ拒否、Service Worker制御、オフラインのシェル起動、オンライン復帰を検査。390px幅のモバイル表示で横はみ出しがないことも確認。
- manifestと食品スキーマのJSON parse：PASS。
- CIは最新対象commit `9e10364485824176299609651b7061fe9c290d80` で成功済み。テスト工程が停止していた問題は解消済みで、Actionsログ上の各工程が完了・成功したことを確認。

## Service Worker / Offline
- **PASS（自動ブラウザシミュレーション）**：キャッシュ名は `macropilot-shell-v2`。`./official-foods.json` はプリキャッシュ対象に追加済み。PWA静的テストで公式食品データを含むキャッシュ資産の存在を確認。
- **PASS（自動ブラウザシミュレーション）**：Service Workerがページを制御した後、Chromiumのofflineモードでシェルが起動し、オンライン復帰後も読み込み可能であることを検査。
- これは実機iPhone・実際のSafari・実際のネットワーク遮断でのPASSではありません。

## 公式食品データ
- `official-foods.json` に2食品を登録し、アプリの対応する食品値にも出典情報を保持。
- ご飯（炊飯後・精白米・うるち米）：食品番号 `01088`、100 gあたり 156 kcal / P 2.5 g / 炭水化物 37.1 g / 脂質 0.3 g。https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7
- 鶏むね肉（若どり・むね・皮なし・焼き）：食品番号 `11288`、100 gあたり 177 kcal / P 38.8 g / 炭水化物 0.1 g / 脂質 3.3 g。https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7
- **未完了**：文部科学省のExcel本体と2026年3月27日付正誤表Excelを取得・解析できず、Excelの行単位の照合は未実施。上記2件は食品成分データベースの個別ページから確認したもので、Excel本体の検査を済ませたという意味ではありません。
- 残りの食品はサンプル概算値であり、公式値として扱っていません。

## 実機・公開に関する未実施事項
- **未実施**：iPhone実機のSafariでの操作QA。
- **未実施**：iPhoneの「ホーム画面に追加」から起動する実機テスト。
- **未実施**：実機のオフライン起動、アプリ復帰、再接続後の動作。
- **未実施**：MacroPilot専用HTTPS URLへの公開・デプロイ確認。
- よって「自動テスト済み」ではありますが、実機QAを完了したとは判定しません。未解決の上記項目があるため、MacroPilot MVPは**完成扱いにしない**でください。

## 公式参照先
- 文部科学省・食品成分表と正誤表掲載ページ：https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html
- 食品成分データベース：https://fooddb.mext.go.jp/
- 正誤表Excel（2026年3月27日）：https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_16.xlsx
