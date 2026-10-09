# MacroPilot MVP QA Report

## 対象と保護境界
- 対象ブランチ：`feature/macropilot-mvp`（`tamatamax-84/pwa-prototype-public` 内）。独立リポジトリではありません。
- Canonical OS：`tamatamax-84/AI-TEAM-NEXUS` / `main` / `OS/AI_TEAM_HQ_OS.md` を今回ロード・検証。`OS_NAME=AI TEAM HQ OS`、`VERSION=v3.0 Compact`、`STATUS=ACTIVE`、`CANONICAL=YES`。OSリポジトリへの書き込みは行っていません。
- `main` と `baseline/pwa-foundation-v1.0` の `index.html`、`app.js`、`manifest.json` は今回再取得し、両ブランチ間でSHAが一致していることを確認。既知の基盤SHAとも一致し、変更なし。

## CI・自動テスト結果
- **PASS**：GitHub Actions run [37965610481](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37965610481)、commit `9e10364485824176299609651b7061fe9c290d80`。状態 `completed`、結論 `success`。
- **PASS**：QA_REPORT.mdを含むcommit `d2633331ef77cbce2656d247ba6a6d3f06ab652d` について、GitHub Actions run [37966160467](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37966160467) が `completed / success`。JavaScript syntax、nutrition and backup validation tests、JSON validationの各ステップがすべて成功。
- JavaScript syntax：PASS。
- `nutrition.test.js`：PASS。19 assertions（量に応じた栄養計算、合計、目標残量、食事追加・削除、日付切替、目標値検証、バックアップ検証）。
- `pwa.test.js`：PASS。スクリプト読込順、オフライン資産リスト、manifest、食品データ出典スキーマの静的検査。
- `official-foods.test.js`：PASS。公式食品データの出典・食品番号・食品状態・栄養値を検査するテスト（出力表示は16 assertions）。
- `browser.test.cjs`：PASS。Playwright Chromiumで、目標保存と再読み込み、食事追加・削除、日付切替、バックアップ書き出し・復元、不正バックアップ拒否、Service Worker制御、オフラインのシェル起動、オンライン復帰を検査。390px幅のモバイル表示で横はみ出しがないことも確認。
- manifestと食品スキーマのJSON parse：PASS。
- **PASS（更新確認）**：前回確認時に停滞中だったrun `37966393204` は、再確認時に `completed / success` となり、JavaScript syntax、Nutrition and backup validation tests、JSON validationの全工程が成功していました。ジョブログURLは引き続き `404 BlobNotFound` で本文を取得できませんでしたが、GitHub Actionsのジョブ・ステップ状態は成功を示しています。停滞は解消しており、ログ取得障害だけでは失敗原因を示す証拠になりません。
- **PASS（最新QAレポート更新commit）**：このQAレポート更新前のcommit `63f5700d08c0e3e71d3de2806a99da2bad5f212c` に対するrun `37966702802` は `completed / success`。レポートを今回更新したため、この更新commit自体のCI結果は新しいActions runで別途確認が必要です。
- **実行中（このレポート更新後のCI）**：QAレポートを更新したcommit `e7fd240322affaf31592738d568d9a98af468a3c` に対するrun [37966884990](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37966884990) は確認時点で `in_progress`。JavaScript syntaxは成功、Nutrition and backup validation testsは実行中、JSON validationは未開始。最新のQAレポート更新コミットについては、完了結果が得られるまでCI PASSと判定しません。

## Service Worker / Offline
- **PASS（自動ブラウザシミュレーション）**：キャッシュ名は `macropilot-shell-v2`。`./official-foods.json` はプリキャッシュ対象に追加済み。PWA静的テストで公式食品データを含むキャッシュ資産の存在を確認。
- **PASS（自動ブラウザシミュレーション）**：Service Workerがページを制御した後、Chromiumのofflineモードでシェルが起動し、オンライン復帰後も読み込み可能であることを検査。
- これは実機iPhone・実際のSafari・実際のネットワーク遮断でのPASSではありません。

## 公式食品データ
- `official-foods.json` に2食品を登録し、アプリの対応する食品値にも出典情報を保持。
- ご飯（炊飯後・精白米・うるち米）：食品番号 `01088`、100 gあたり 156 kcal / P 2.5 g / 炭水化物 37.1 g / 脂質 0.3 g。https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7
- 鶏むね肉（若どり・むね・皮なし・焼き）：食品番号 `11288`、100 gあたり 177 kcal / P 38.8 g / 炭水化物 0.1 g / 脂質 3.3 g。https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7
- **未完了**：文部科学省のExcel本体と2026年3月27日付正誤表Excelを取得・解析できず、Excelの行単位の照合は未実施。追加調査で、文部科学省の食品成分データベースは検索結果をCSV形式でダウンロードできると公式ヘルプに記載されていることを確認しました（https://fooddb.mext.go.jp/help.html）。データベース自体は2026年6月9日に2026年3月27日付正誤表を反映したと明記しています（https://fooddb.mext.go.jp/history.pl）。これはExcel/正誤表の取得・行単位比較の代替完了を意味しません。公式ヘルプでは検索結果のCSVダウンロード機能が明記されています（https://fooddb.mext.go.jp/help.html）。ただし今回、検索UIを通じたCSVの実ダウンロード・機械解析はまだ実施できていません。したがってCSV経路は「公式機能の存在確認済み、実データ取得・照合は未実施」と記録します。上記2件は食品成分データベースの個別ページから確認したもので、Excel本体の検査を済ませたという意味ではありません。
- **代替経路の再調査（2026-10-10）**：文部科学省の公式Excel URLをWeb取得ツールで直接開くと、XLSXのMIME typeが未対応として拒否されました。栄養関連の専門出版社による解説ページから同じ公式正誤表リンクを辿っても、同じ公式XLSX URLに到達し、ファイル内容は取得できませんでした。別のコンテナダウンロード経路も失敗しました。よって、代替経路でもバイナリの取得・解析はできておらず、正誤表の行単位照合は引き続き未実施です。参照した解説ページ：https://www.eiyotoryori-plus.com/webmagazine/food_composition_table/9706/
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


## 追加検証（2026-10-10・run 38cf8e8 対応確認）
- **PASS**：QAレポート更新commit `38cf8e8c74b36ae532570dce0ab4ffd735357b18` に対するGitHub Actions run [37966931246](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37966931246) は `completed / success`。ジョブ `validate` および以下のステップがすべて `success`：Set up job、checkout、setup-node、JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理。失敗ステップはなく、修正・再実行は不要。
- **PASS**：直前のQAレポート更新commit `e7fd240322affaf31592738d568d9a98af468a3c` のrun [37966884990](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37966884990) も `completed / success`。同じ3つの検証ステップが成功。
- **食品データ・検索UI経路**：文部科学省 食品成分データベースのヘルプに、検索結果をCSV形式でダウンロードできる旨が明記されている（https://fooddb.mext.go.jp/help.html）。検索画面（https://fooddb.mext.go.jp/search.html）も確認したが、この実行環境では検索フォームを操作してCSVファイルを実ダウンロード・解析するところまでは到達できなかった。よって**CSV実データ取得・CSVからの行単位照合は未実施**。機能説明を実データ取得済みと扱わない。
- **代替データによる照合（CSVの代替であり、CSV検証の代替完了ではない）**：
  - ご飯（炊飯後）：公式個別ページは食品番号 `01088`、食品状態「こめ［水稲めし］/精白米/うるち米」、100gあたり 156 kcal / たんぱく質 2.5g / 脂質 0.3g / 炭水化物 37.1g を表示（https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7）。民間サイトRelife Dietも食品番号01088と同じ4値を掲載（https://diet.relifeinc.jp/food/01088/）。食品番号・状態・主要栄養値の一致を確認した。ただし独立した一次データではなく、民間サイトは成分表を参照している二次情報。
  - 鶏むね肉（皮なし・焼き）：公式個別ページは食品番号 `11288`、食品状態「若どり・むね・皮なし・焼き」、100gあたり 177 kcal / たんぱく質 38.8g / 脂質 3.3g / 炭水化物 0.1g を表示（https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7）。民間サイトRelife Dietも食品番号11288と同じ4値を掲載（https://diet.relifeinc.jp/food/11288/）。食品番号・状態・主要栄養値の一致を確認した。ただし独立した一次データではなく、民間サイトは成分表を参照している二次情報。
  - 文部科学省の公表ページでは2026年3月27日付正誤表が案内されている（https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html）。正誤表ファイル自体の取得・解析は今回も未実施のため、今回の民間サイト照合は当該正誤表の全行確認を代替しない。
- **実機・公開ゲート**：iPhone実機Safari、ホーム画面追加、実機オフライン起動・復帰・再接続、HTTPS公開の状態は引き続き**未実施／未確認**。自動Chromiumテスト結果から実機PASSを推定しない。
- **保護境界**：今回の書き込み先は `feature/macropilot-mvp` のみ。 `main`、`baseline/pwa-foundation-v1.0`、Canonical OSリポジトリは変更対象にしていない。MacroPilot MVPは未解決ゲートが残るため**未完成**のまま。


## 追加検証（2026-10-10・Run #37967246151完了／CSV取得経路の再評価）
- **PASS**：commit `e38967c1350600f59385912001cb41d64eddaab0` のGitHub Actions run [37967246151](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37967246151) は `completed / success`。ジョブ `validate` が成功し、JavaScript syntax、Nutrition and backup validation tests、JSON validation、およびセットアップ・後処理の各ステップもすべて成功。失敗ステップはなく、修正・再実行は不要。
- **CSV取得の障害箇所を再評価**：公式検索トップ（https://fooddb.mext.go.jp/search.html）から「フリーワードで検索」へ移動すると、検索フォームは `/freeword/fword_top.pl` 内のiframeとして表示される。検索結果ページのCSVダウンロードは検索結果画面の操作機能として説明されている（公式ヘルプ：https://fooddb.mext.go.jp/help/help_r.html）。したがって、単純に検索ページURLを開くだけではCSV URLを得られず、(1) iframe内フォームへの入力、(2) フォーム送信による検索結果セッション／結果画面の生成、(3) 結果画面のCSVダウンロード操作、というブラウザ操作列が必要。今回の取得環境ではiframe内フォームを実操作してPOST/セッションを生成し、ダウンロード操作まで実行するブラウザ機能がなく、ここが実取得のブロッカー。CSVの直接URLやパラメータを推測して呼び出す方法は、未確認のエンドポイントを捏造することになるため採用しない。
- **代替の次善策**：対象食品の公式個別詳細ページを直接参照し、食品番号・食品状態・栄養値を公式表示と照合する。独立した補助確認として民間サイトRelife Diet（https://diet.relifeinc.jp/food/01088/、https://diet.relifeinc.jp/food/11288/）の食品番号と栄養値も比較した。両サイト値は一致したが、二次情報であり、CSVデータの代替取得や正誤表全行照合の完了とはみなさない。
- **今回のCSV実データ取得結果**：未取得。CSVダウンロード機能の存在と操作構造は公式ヘルプ／検索画面で確認したが、CSVファイル自体をダウンロード・解析できていないため、CSVからの行単位照合は未実施。
- **未解決ゲート**：2026年3月27日付正誤表のファイル取得・行単位照合、iPhone実機Safari、ホーム画面追加、実機オフライン起動・復帰・再接続、HTTPS公開は未実施／未確認。MacroPilot MVPは完成扱いにしない。
- **保護境界**：今回の更新は `feature/macropilot-mvp` の `macropilot/QA_REPORT.md` のみ。`main`、`baseline/pwa-foundation-v1.0`、Canonical OSリポジトリは変更していない。


## 追加検証（2026-10-10・Run #37967531194最終確認／食品データ拡張方式）
- **PASS**：GitHub Actions run [37967531194](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37967531194) を再取得。対象commitは指定どおり `c30bbe5ffbba6641378b0a7cdb0ba9d146a3f556`、branchは `feature/macropilot-mvp`、状態 `completed`、結論 `success`。ジョブ `validate`（ID `113945529010`）と全ステップ（setup、checkout、setup-node、JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理）が `success`。失敗なしのため修正・再実行は不要。
- **CSV取得の別経路を再検討**：現在利用可能な実行ツールを確認したが、外部サイトのiframe内でフォームを入力・送信し、セッション付き結果画面からファイルをクリックして保存する実ブラウザ自動操作／ファイルダウンロード経路は利用できなかった。公式ヘルプは検索結果CSV機能を明記している（https://fooddb.mext.go.jp/help.html、https://fooddb.mext.go.jp/help/help_r.html）が、今回もCSVファイル自体は取得していない。直接URLやPOSTパラメータの推測は行っていない。**CSV実取得・解析・CSV行単位照合：未実施**。
- **公式個別ページ＋民間二次情報の拡張案**：公式個別ページを基準データとし、食品番号、食品状態、食品名、単位（可食部100g）、各栄養値、出典URL、取得日、データ版、確認ステータスを構造化して別JSONファイルに蓄積する方式は技術的に可能。現在も `official-foods.json` は別ファイルだが、現状2件のみ。テスト `official-foods.test.js` は現在 `foods.length === 2` を固定検査しているため、大規模化時は件数固定をやめ、ID一意性・必須スキーマ・出典ドメイン・数値型・食品番号/食品状態・重複・検証ステータス・代表食品の期待値を検査するテストへ変更する必要がある。アプリ側の `nutrition-core.js` は食品配列を受け取って計算する汎用処理であり、データを別JSONに分離して拡張する設計と整合する。
- **採用基準（未実装の提案）**：公式個別ページを一次ソースとして記録し、民間サイトは独立一次ソースとは見なさず二次的な不一致検出に限定する。食品番号・調理状態・100g基準・エネルギー/P/F/Cを一致確認し、不一致は自動採用せず例外記録へ送る。正誤表の反映確認を各レコードに明記し、確認できないものを「正誤表照合済み」と表示しない。確認済みレコードと未確認レコードは別の状態で管理する。
- **現時点のデータ収集結果**：今回、新規の大量収集やレコード追加は行っていない。既存の2件は公式個別ページと民間二次情報の主要値一致を確認済みだが、民間サイトは公式データからの派生情報である可能性があり、独立した一次検証ではない。別JSON方式は実装可能と判断するが、大規模収集・整合性QA・アプリ連携の実装完了とは扱わない。
- **引き続き未実施／未確認**：2026年3月27日付正誤表の取得と行単位照合、CSV実取得・解析、iPhone実機Safari、ホーム画面追加、実機オフライン復帰／再接続、HTTPS公開。
- **完成判定**：未解決ゲートが残るため MacroPilot MVP は引き続き**未完成**。保護対象の `main`、`baseline/pwa-foundation-v1.0`、Canonical OSリポジトリは変更していない。今回の書き込みは `feature/macropilot-mvp/macropilot/QA_REPORT.md` のみ。


## 追加検証（2026-10-10・食品データ仕様／実行時統合）
- **公式個別ページ再確認**：文部科学省の公式詳細ページで食品番号・食品状態・主要値を再確認。ご飯は食品番号 `01088`、炊飯後の精白うるち米、100gあたり156kcal・P2.5g・脂質0.3g・炭水化物37.1g（https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7）。鶏むね肉は食品番号 `11288`、若どり・むね・皮なし・焼き、100gあたり177kcal・P38.8g・脂質3.3g・炭水化物0.1g（https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7）。民間Relife Dietの該当ページでも食品番号と主要値の一致を確認（https://diet.relifeinc.jp/food/01088/、https://diet.relifeinc.jp/food/11288/）。民間サイトは二次情報であり独立した一次ソースとは扱わない。
- **データ仕様を更新**：`official-foods.json` に `errataStatus`、`secondarySources`、`secondaryCheck` を追加し、ステータスを `OFFICIAL_PAGE_SECONDARY_MATCH` に変更。正誤表の行単位照合は未実施のため、両レコードの `errataStatus` は明示的に `NOT_ROW_CHECKED`。版情報は「公式個別ページ確認」とし、正誤表対応済みとの誤認を避ける。
- **スキーマ／テストを拡張**：`food-data.schema.json` に二次情報と正誤表照合状態の仕様を追加。`official-foods.test.js` は件数を2件固定するのをやめ、ID・食品番号の一意性、100g基準、主要栄養値の数値範囲、出典URL、食品状態、検証日、二次照合状態、正誤表状態を検査する方式へ変更。`pwa.test.js` も別JSONの読込とオフラインキャッシュ参照を確認するよう変更。
- **アプリへのデータ統合**：`app.js` は `./official-foods.json` を取得し、対応する食品の栄養値と出典情報を実行時に反映するよう変更。取得失敗時は既存の内蔵試作値へフォールバックするが、その値を公式確認済みと新たに表示するものではない。Service Workerの既存プリキャッシュに `official-foods.json` が含まれていることを再確認。実機ではなくコードとCIによる検証段階。
- **新規食品の追加**：今回、根拠の取得・照合ができた既存2食品以外は追加していない。大規模データの収集・一括整合性確認は未実施。
- **CI**：本更新により新しいGitHub Actions runが複数起動している。最終の `feature/macropilot-mvp` HEADに対応するrunを完了まで追跡し、成功・失敗の実測結果を下記に追記する。結果が出るまでは今回のコード変更全体をCI PASSと判定しない。
- **未実施のまま**：CSV実取得・解析、2026年3月27日付正誤表の行単位照合、iPhone実機Safari、ホーム画面追加、実機オフライン復帰／再接続、HTTPS公開。
- **保護境界**：変更先は `feature/macropilot-mvp` 内のみ。`main`、`baseline/pwa-foundation-v1.0`、Canonical OSリポジトリは変更していない。MacroPilot MVPは未完成。


## 追加検証（2026-10-10・食品データ統合後CI完了）
- **PASS**：統合後のcommit `15a46dc309f51eb456a66c35ef08d5edf1807fe4` に対するRun [37968667795](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37968667795) は `completed / success`。全ステップ成功：JavaScript syntax、Nutrition and backup validation tests（nutrition、PWA、食品データ検証、Playwright Chromiumブラウザ統合）、JSON validation、後処理。
- **回復記録**：途中commit `d65fee0...` と `0552d7c...` のCIでは、PWAテストにリテラルの `\\n` が混入してJavaScript構文検査が失敗。ログから原因を特定し、`pwa.test.js` の不正な文字列を除去。修正後のrun [37968605467](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37968605467) は成功し、さらに最終統合commitのrun [37968667795](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37968667795) も全工程成功を確認。
- **機能QAの範囲**：CIのPlaywright Chromiumテストは目標保存、食事追加・削除、日付切替、バックアップ、Service Workerによるオフラインシェル、オンライン復帰をPASS。これは自動Chromium試験であり、iPhone実機のSafari・ホーム画面追加・実機オフライン復帰のPASSではない。
- **残課題**：CSV実取得・解析、2026年3月27日付正誤表の行単位照合、大規模食品データ収集と整合性QA、iPhone実機Safari、ホーム画面追加、実機オフライン復帰／再接続、HTTPS公開は未実施／未確認。したがってMacroPilot MVPは未完成。
- **保護境界**：変更は `feature/macropilot-mvp` 内のみ。 `main`、`baseline/pwa-foundation-v1.0)、Canonical OSリポジトリは変更していない。


## 最終QA追跡（2026-10-10）
- **PASS**：QAレポート更新commit `2471ef9e913a9f4969c14df3ee48bd2decaa2f9c` に対するRun [37968754942](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37968754942) を再確認。状態 `completed`、結論 `success`。Job `validate` と全ステップ（checkout、setup-node、JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理）が成功。
- **保護境界の再確認**：`main` と `baseline/pwa-foundation-v1.0` の `index.html`、`app.js`、`manifest.json` のSHAはそれぞれ一致し、変更なし。Canonical OSは `tamatamax-84/AI-TEAM-NEXUS/main/OS/AI_TEAM_HQ_OS.md` をロードし、`OS_NAME=AI TEAM HQ OS`、`VERSION=v3.0 Compact`、`STATUS=ACTIVE`、`CANONICAL=YES`、Repository／Pathが指定値であることを確認。Canonical OSへの書き込みなし。
- **完成判定**：CI PASSは現HEADの自動検証結果であり、外部・実機ゲートを代替しない。CSV実取得・解析、2026-03-27正誤表の行単位照合、大規模データの整合性確認、iPhone実機Safari、ホーム画面追加、実機オフライン復帰／再接続、HTTPS公開は未確認のまま。MacroPilot MVPは未完成。


## 最終QA追跡（2026-10-10・Run #37969331609）
- **PASS**：Run [37969331609](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37969331609) を再確認。対象commit `96661f0197d342803602e23a16775454ec273de0`、branch `feature/macropilot-mvp`、状態 `completed`、結論 `success`。ジョブ `validate`（ID `113951626094`）は成功し、Set up job、checkout、setup-node、JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理の全ステップが `success`。失敗ステップはなく、修正・再実行は不要。
- **QAレポート更新後CI**：本追記自体を `feature/macropilot-mvp` にコミットし、その更新commitのGitHub Actionsを完了まで追跡する。追記後のrunが完了・成功するまでは、この最新QAレポート更新をCI PASSと扱わない。
- **未解決ゲート／完成判定**：CSV実取得・解析、2026-03-27正誤表の行単位照合、大規模食品データの整合性QA、iPhone実機Safari、ホーム画面追加、実機オフライン復帰・再接続、HTTPS公開は未実施／未確認。自動CIの成功はこれらの実機・データ検証を代替しない。MacroPilot MVPは**未完成**。
- **保護境界**：変更先は `feature/macropilot-mvp/macropilot/QA_REPORT.md` のみ。`main`、`baseline/pwa-foundation-v1.0`、Canonical OSリポジトリは変更しない。


## 未解決ゲート再調査（2026-10-10・公式CSV／正誤表取得経路）
- **公式ソース再確認**：文部科学省の食品成分データベースのヘルプは、検索結果をCSV形式でダウンロードできると明記している（https://fooddb.mext.go.jp/help.html、検索結果画面ヘルプ https://fooddb.mext.go.jp/help/help_r.html）。また、データベースの更新履歴は2026年6月9日に2026年3月27日付正誤表へ対応したと記載している（https://fooddb.mext.go.jp/history.pl）。これは公式サイト内データベースの更新説明であり、MacroPilot用CSV取得や正誤表ファイルの行単位比較を実施した証拠ではない。
- **CSV実取得の結果：未取得**。公式ヘルプからCSVダウンロード機能の存在を再確認したが、取得可能な実行環境では、検索フォームへの入力・送信後に結果画面を作り、結果画面のCSVダウンロード操作でファイルを保存するブラウザ操作を実行できなかった。未確認のダウンロードURLやPOSTパラメータは推測していない。CSVの実データ解析、全件数確認、列・食品番号の整合性QAは未実施。
- **正誤表Excel取得の結果：未取得**。文部科学省の掲載ページ（https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html）の「正誤表（データ）」リンクを確認し、公式URL https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_16.xlsx を再試行したが、Web取得環境ではXLSX MIME typeが未対応として拒否された。コンテナからのHTTPS取得もDNS解決エラーで失敗した。Excelバイナリの解析、シート・行・セルの比較、既存食品2件への正誤表適用確認はいずれも未実施。正誤表の行単位照合はPASSではない。
- **既存2食品の範囲**：公式個別ページの表示値と既存の二次情報の一致確認は、過去記録どおり2食品に限る。これを食品成分表全体の整合性QAへ一般化しない。大量食品の追加・一括検証は今回も未実施。
- **実機・公開ゲート**：iPhone実機Safari、ホーム画面追加、実機オフライン復帰・再接続、HTTPS公開は今回も未実施／未確認。Chromium自動テストから実機PASSを推定しない。
- **保護境界の再確認**：feature/macropilot-mvp のHEADは f186a7b19aeae8bacb1c77363b6579edcd2a2787。main と baseline/pwa-foundation-v1.0 の index.html SHA（3f9089932743669250e70e10648b4e5d5a65733a）、app.js SHA（aeb20927afa365bcc167d5ba05ce43e4d30cfad3）、manifest.json SHA（137f45e1abc13bd345cc33044c02dea4b5a0a9f1）は各々一致。Canonical OSは tamatamax-84/AI-TEAM-NEXUS/main/OS/AI_TEAM_HQ_OS.md からロードし、v3.0 Compact / ACTIVE / CANONICAL YESとRepository・Pathを検証。Canonical OSへの書き込みなし。
- **完成判定**：CSV実取得、正誤表行単位照合、大規模食品データ整合性QA、実機・公開ゲートが未解決のため、MacroPilot MVPは引き続き**未完成**。本追記後のCI結果は別途Runを確認し、完了前にPASSと判定しない。

## 代替QA追記（2026-10-10・公式個別ページ全栄養値照合／テスト強化）
- **公式個別ページ照合：2/2件を確認**（対象は現在 official-foods.json にある全2件）。公式ページは日本食品標準成分表（八訂）増補2023年のページであることを確認。
- **rice**：食品番号 `01088`。公式食品名は「穀類/こめ/［水稲めし］/精白米/うるち米」。MacroPilotの食品状態「炊飯後・精白米・うるち米」と意味が一致。公式ページの可食部100g値はエネルギー156 kcal、たんぱく質2.5g、脂質0.3g、炭水化物37.1g。登録済み4値すべて一致。一次ソース：https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7
- **chicken**：食品番号 `11288`。公式食品名は「肉類/＜鳥肉類＞/にわとり/［若どり・主品目］/むね/皮なし/焼き」。MacroPilotの食品状態「若どり・むね・皮なし・焼き」と意味が一致。公式ページの可食部100g値はエネルギー177 kcal、たんぱく質38.8g、脂質3.3g、炭水化物0.1g。登録済み4値すべて一致。一次ソース：https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7
- **照合範囲の制約**：今回の登録済み栄養値4項目（エネルギー、たんぱく質、炭水化物、脂質）を両食品で照合した。公式ページの全栄養素をMacroPilotへ登録したわけではなく、全栄養素の一括比較ではない。民間二次情報の一致を一次ソースとして数えていない。
- **正誤表の代替経路で新たに確認した事実**：文部科学省食品成分データベースの公式更新履歴は、2026年6月9日に「日本食品標準成分表（八訂）増補2023年」について、令和8年3月27日公表の正誤表に対応したと明記している：https://fooddb.mext.go.jp/history.pl 。これは、現行の個別ページがそのデータベース更新後の表示であることを裏付ける。ただし、正誤表Excelの取得・各行の食品番号照合・変更前後のセル比較は実施していない。したがって両食品の errataStatus は引き続き NOT_ROW_CHECKED であり、正誤表行単位QAはPASSではない。公式の正誤表HTML一覧 https://fooddb.mext.go.jp/help/errata.html も確認したが、これは過年度の訂正一覧を含むページであり、2026年3月27日付の該当Excelの行照合を代替しない。
- **自動テストを強化**：official-foods.test.js に、2件の食品番号・公式URL・食品状態・100g基準・登録済み4栄養値すべての完全一致を検証するアサーションを追加。食品件数が将来増えても、全レコードの一意性・出典・検証状態チェックを維持する。
- **栄養計算・バックアップテストを強化**：nutrition.test.js に、0g計算、NaN/Infinity、不正な食品基準量、null食品、未知食品ID、0以下の食事量、不正な食事区分、不正バックアップ量・食事区分・目標値・logs形式などの境界テストを追加。これらは公式データ取得に依存しないロジック検証。
- **更新commitとCI**：公式食品照合テスト更新commit `432e266489021b162e18f8424c58624ff7e9378f`。栄養・バックアップテスト更新commit `b528873bb37d665ca8386968e7b03bc76ae919eb`。両commitのActions結果と、QAレポート更新commitのActions結果を別途追跡し、完了・成功するまでは今回の更新全体をCI PASSと判定しない。
- **未解決**：CSV実取得・解析、2026年3月27日付正誤表の行単位照合、全食品データの網羅性・大規模整合性QA、iPhone実機Safari、ホーム画面追加、実機オフライン起動・復帰・再接続、HTTPS公開。MacroPilot MVPは未完成。
- **保護境界**：コード更新先は feature/macropilot-mvp の macropilot/official-foods.test.js と macropilot/nutrition.test.js のみ。main、baseline/pwa-foundation-v1.0、Canonical OSリポジトリは変更していない。