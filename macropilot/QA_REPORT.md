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
## CI追跡更新（2026-10-10・QA拡張コミット）
- **PASS**：公式食品照合テストcommit `432e266489021b162e18f8424c58624ff7e9378f` のGitHub Actions [Run #37970384585](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970384585) は `completed / success`。JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理を含む全ステップ成功。
- **PASS**：栄養・バックアップ境界テストcommit `b528873bb37d665ca8386968e7b03bc76ae919eb` のGitHub Actions [Run #37970395238](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970395238) は `completed / success`。JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理を含む全ステップ成功。
- **QAレポート更新commitのCI**：本追記の直前のレポート更新commit `f7a108476e3abe24048afbdb2954941563b26edc` のRun [#37970432894](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970432894) は最終確認時点で `in_progress`。JavaScript syntaxは成功、Nutrition and backup validation testsは実行中、JSON validationは未開始。ジョブログ取得は `BlobNotFound` で失敗し、ログ本文は確認できない。完了結果が得られるまでは当該レポート更新をCI PASSと扱わない。
- **次の追跡対象**：本追記によって新しいcommitとActions runが作成されるため、当該更新commitのrunを別途追跡し、完了・結論を確認する。
- **ゲート状況**：2食品の登録済み4栄養値は公式個別ページと一致し、該当する自動テストは成功。正誤表の行単位照合、CSV実取得、全食品網羅性QA、iPhone実機Safari、ホーム画面追加、実機オフライン復帰・再接続、HTTPS公開は未解決。MacroPilot MVPは未完成。
## 食品データ拡充（2026-10-10・二次情報を許容した初回バッチ）
- **データ件数：2件 → 9件（+7件）**。今回追加した7件は二次情報サイト Relife Diet の個別ページに記載された日本食品標準成分表（八訂）増補2023年由来の食品番号・100gあたり主要栄養値を転記した。個人ブログ等も今後の候補ソースとするが、出典品質を混同しないため、今回のデータは `SECONDARY_SOURCE_UNVERIFIED` として追加した。
- **新規追加レコード**：
  - `tofu_momen` 木綿豆腐・食品番号04032：73 kcal / P 7.0g / C 1.5g / F 4.9g。出典 https://diet.relifeinc.jp/food/04032/
  - `natto` 納豆（糸引き納豆）・食品番号04046：184 kcal / P 16.5g / C 12.1g / F 10.0g。出典 https://diet.relifeinc.jp/food/04046/
  - `broccoli_raw` ブロッコリー（生）・食品番号06263：37 kcal / P 5.4g / C 6.6g / F 0.6g。出典 https://diet.relifeinc.jp/food/06263/
  - `tuna_water_canned` ツナ缶（まぐろ・水煮フレーク・ライト）・食品番号10260：70 kcal / P 16.0g / C 0.2g / F 0.7g。出典 https://diet.relifeinc.jp/food/10260/
  - `sweet_potato_steamed_peeled` さつまいも（皮なし・蒸し）・食品番号02007：131 kcal / P 1.2g / C 31.9g / F 0.2g。出典 https://diet.relifeinc.jp/food/02007/
  - `soy_milk_unadjusted` 豆乳（無調整）・食品番号04052：43 kcal / P 3.6g / C 2.3g / F 2.8g。出典 https://diet.relifeinc.jp/food/04052/
  - `soybean_dry_domestic` 大豆（国産・乾）・食品番号04023：372 kcal / P 33.8g / C 29.5g / F 19.7g。出典 https://diet.relifeinc.jp/food/04023/
- **データの使い分け**：既存の `rice` と `chicken` は公式個別ページ照合済み。新規7件は二次情報の記載を取得したが、文部科学省の公式個別ページと食品状態・栄養値の独立照合は未実施。したがって公式照合済み件数には算入しない。全9件の正誤表行単位照合は未実施。
- **スキーマとテストの変更**：`food-data.schema.json` に `SECONDARY_SOURCE_UNVERIFIED` を追加。`official-foods.test.js` は二次情報レコードの出典URL・食品番号・4栄養値・未照合ステータスを検証し、未確認データが公式照合済みとして扱われないことを確認する。データ件数は9件、うち公式個別ページ照合済み2件、二次情報のみ7件。
- **更新commit**：食品データ `d7b76128a51c7fef95f02178c471e526f688da78`、スキーマ `0a1c632522dc15ffe4bd1809f587c938b42a3f34`、食品テスト `9068f6c281a0313e76be30745343de2e2190de55`。それぞれのGitHub Actionsを追跡し、完了するまではCI PASSを宣言しない。
- **残存ゲート**：正誤表行単位照合、公式CSV取得、全データセットの網羅性QA、iPhone実機Safari、ホーム画面追加、実機オフライン復帰・再接続、HTTPS公開。MacroPilot MVPは未完成。
## 自律Recovery（2026-10-10・二次情報ステータスのテスト不整合）
- 初回食品データ追加commit `d7b76128a51c7fef95f02178c471e526f688da78` の [Run #37970790422](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970790422) は失敗。ログで `official-foods.test.js` の provenance status allowlist が新設 `SECONDARY_SOURCE_UNVERIFIED` を許可していないことを確認した。
- スキーマcommit `0a1c632522dc15ffe4bd1809f587c938b42a3f34` の [Run #37970808944](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970808944) も失敗。ログでテスト側の公式URL限定assertionが二次情報レコードを拒否していたことを確認した。
- テストcommit `9068f6c281a0313e76be30745343de2e2190de55` の [Run #37970813317](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970813317) は失敗。ログで二次情報ステータスのallowlist不一致を確認した。
- Recoveryとして `official-foods.test.js` のステータスallowlistを修正し、`SECONDARY_SOURCE_UNVERIFIED` を許可対象に追加した。修正commit `5dc50fd5aacbf4a14e881d7bb49f4469e5d16a56` のActions結果は未確認のため、修正後CIが成功するまで食品データ拡充QAをPASSとしない。
- 本レポート更新commit `484e2027d683c01488d507da1c52b9f56b3c0385` はRunの検索時点でまだ一覧に現れず、Actions実行確認未取得。
## 食品データ第2バッチ（2026-10-10・さらに7件追加）
- データセットは合計 **16件**（公式個別ページ照合済み2件＋二次情報のみ14件）に拡張した。追加分はすべて `SECONDARY_SOURCE_UNVERIFIED`、`secondaryCheck=NOT_CHECKED`、`errataStatus=NOT_ROW_CHECKED` を保持する。
- 追加食品：スパゲッティ・マカロニ（乾）01063（347 kcal/P12.9/C73.1/F1.8、https://diet.relifeinc.jp/food/01063/）、なす（生）06191（18/P1.1/C5.1/F0.1、https://diet.relifeinc.jp/food/06191/）、大根（皮なし・生）06134（15/P0.4/C4.1/F0.1、https://diet.relifeinc.jp/food/06134/）、豚ロース（脂身つき・生）11123（248/P19.3/C0.2/F19.2、https://diet.relifeinc.jp/food/11123/）、テンペ04063（180/P15.8/C15.4/F9.0、https://diet.relifeinc.jp/food/04063/）、三つ葉（切りみつば・生）06274（16/P1.0/C4.0/F0.1、https://diet.relifeinc.jp/food/06274/）、強力粉01020（337/P11.8/C71.7/F1.5、https://diet.relifeinc.jp/food/01020/）。栄養値は各二次情報ページに表示された100gあたり値。
- 第2バッチデータcommit `ba7a32cc5bce7c12b2beeb8b0557ae5aec12d039`、対応テストcommit `dfb63a3f75c5370138dead126f138e9c19ed1f84`。最新テストは16件すべてのID・食品番号一意性、主要栄養値、出典URL、検証状態を検査する。CI結果は別途追跡中。
- **Recovery後のCI**：status allowlist修正commit `5dc50fd5aacbf4a14e881d7bb49f4469e5d16a56` のRun #37970889384、およびそのQAレポートcommit `2ded6c4fca54a8092db8136dfaea959c2cd84b4f` のRun #37970903964 は、最終確認時点でともに `in_progress`。nutrition/backup validationステップが実行中表示のままのため、成功を宣言しない。
- 二次情報データは検索・食事記録のカバレッジ拡大用の暫定データ。健康判断や厳密な栄養管理の根拠として公式照合済みと同等に扱わない。食品状態の曖昧さ、ブランド品、調理油・調味料込みの料理は別レコードとして分離し、異なる状態の数値を混ぜない。
## CI結果追記（2026-10-10・16食品データセット）
- `ba7a32cc5bce7c12b2beeb8b0557ae5aec12d039` の [Run #37970951386](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970951386) は失敗。ログで食品件数を9件に固定した旧テスト期待値と、16件に拡張したデータセットの不一致を確認した。これはデータ値の不一致ではなくテストの期待件数更新漏れ。
- 期待件数を16件に修正したテストcommit `dfb63a3f75c5370138dead126f138e9c19ed1f84` の [Run #37970965230](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970965230) は最終確認時点で `in_progress`。構文検査は成功、栄養・バックアップ検証ステップは実行中表示。完了結果は未取得。
- status allowlist修正commit `5dc50fd5aacbf4a14e881d7bb49f4469e5d16a56` の [Run #37970889384](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970889384) も `in_progress` 表示のまま更新時刻が停滞しており、完了結論を確認できていない。一方、その次のQAレポートcommit `2ded6c4fca54a8092db8136dfaea959c2cd84b4f` の [Run #37970903964](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37970903964) は `completed / success`。
- したがって、食品追加・テスト拡張の最新状態をCI PASSと報告しない。次のレポートcommitのActionsも追跡対象。

## CI追跡完了・食品データ第3バッチ（2026-10-10）
- **完了・PASS**：QAレポート更新commit `7684281608f64163eafa8d021e9c03c94048d41d` の [GitHub Actions Run #37971067644](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/37971067644) を再確認。対象branch `feature/macropilot-mvp`、状態 `completed`、結論 `success`。job `validate`（ID `113957513039`）と JavaScript syntax、Nutrition and backup validation tests、JSON validation、setup/checkout/後処理の全ステップが成功。
- **食品データ件数**：16件から26件へ拡張。新規10件はすべて二次情報サイト Relife Diet の食品別ページに表示された値を転記し、`SECONDARY_SOURCE_UNVERIFIED`、`secondaryCheck=NOT_CHECKED`、`errataStatus=NOT_ROW_CHECKED` を維持。公式個別ページで独立照合済みの件数は従来どおり2件。
- **追加10件（100gあたり kcal / たんぱく質g / 炭水化物g / 脂質g）**：
  - 卵（鶏卵・全卵・生）12004：142 / 12.2 / 0.4 / 10.2。出典 https://diet.relifeinc.jp/food/12004/
  - 牛乳（普通牛乳）13003：61 / 3.3 / 4.8 / 3.8。出典 https://diet.relifeinc.jp/food/13003/
  - 鮭（しろさけ・生）10134：124 / 22.3 / 0.1 / 4.1。出典 https://diet.relifeinc.jp/food/10134/
  - さば（まさば・生）10154：211 / 20.6 / 0.3 / 16.8。出典 https://diet.relifeinc.jp/food/10154/
  - トマト（生）06182：20 / 0.7 / 4.7 / 0.1。出典 https://diet.relifeinc.jp/food/06182/
  - にんじん（皮なし・生）06214：32 / 0.7 / 8.8 / 0.2。出典 https://diet.relifeinc.jp/food/06214/
  - キャベツ（生）06061：23 / 1.2 / 5.2 / 0.1。出典 https://diet.relifeinc.jp/food/06061/
  - 鶏もも肉（皮なし・生）11224：113 / 19.0 / 0 / 5.0。出典 https://diet.relifeinc.jp/food/11224/
  - プレーンヨーグルト（全脂・無糖）13025：56 / 3.6 / 4.9 / 3.0。出典 https://diet.relifeinc.jp/food/13025/
  - しょうが（皮なし・生）06103：28 / 0.9 / 6.6 / 0.3。出典 https://diet.relifeinc.jp/food/06103/
- **出典不一致の扱い**：今回の各出典ページでは、同一食品ページに調理状態別の比較値が表示されるものがある（例：卵の生142／ゆで134／いり190 kcal、さばの生211／水煮253／焼き264 kcal、鶏もも皮なしの生113／ゆで141／焼き145 kcal）。これは同一食品状態の不一致とは見なさず、食品状態が異なる別値として保持。異なる状態・食品番号間の数値は統合していない。独立した同一状態の二次ソース間でのクロスチェックは未実施であり、`CONFLICT` の有無を確定できるだけの比較資料は未取得。
- **自動テスト**：`official-foods.test.js` を更新し、全26件のID／食品番号一意性、100g基準、非負・有限の4栄養値、出典URL、検証ステータス、二次情報14件＋今回10件の値を明示的に検証。データ件数期待値を26件へ更新。
- **更新commitとCI追跡対象**：食品データcommit `d6d673f6988d347e3d43d7a5331cbef023f8c937`、テストcommit `ce6a8d263926a66ce35d8a737a7d05c893e98ec5`、本QAレポート追記commitはそれぞれGitHub Actionsを追跡する。最新runが完了・successと確認されるまで、当該commitのCI PASSを宣言しない。
- **未解決ゲート**：公式CSV実取得・解析、2026-03-27正誤表の行単位照合、同一食品状態の複数ソース間比較、データセット網羅性・大規模整合性QA、果物・調味料・加工食品を含むカバレッジ拡張、iPhone実機Safari／ホーム画面追加／オフライン復帰・再接続、HTTPS公開は未解決。MacroPilot MVPは**未完成**。
- **保護境界**：変更先は `feature/macropilot-mvp` の `macropilot/official-foods.json`、`macropilot/official-foods.test.js`、`macropilot/QA_REPORT.md` のみ。main、baseline/pwa-foundation-v1.0、Canonical OSリポジトリは変更していない。


## 第3バッチCI Recovery追記（2026-10-10）
- **検出した失敗**：食品データcommit `d6d673f6988d347e3d43d7a5331cbef023f8c937` の [Run #38000529805](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000529805) は `completed / failure`。ログでは JavaScript syntax はPASS、食品テストが旧期待件数16と実データ26の不一致（`26 !== 16`）で失敗し、JSON validationは未実行。栄養値の不一致を示す失敗ではなく、件数テストの更新漏れ。
- **修正と再検証**：`official-foods.test.js` の件数期待値を26に変更し、新規10件の食品番号・出典URL・4栄養値・未検証ステータスを追加したテストcommit `ce6a8d263926a66ce35d8a737a7d05c893e98ec5` の [Run #38000542751](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000542751) は、job `validate`（ID `114057266417`）および全stepが `completed / success` と確認。Actions run本体は最終照会時点で `in_progress` 表示のままなので、run全体の完了状態は未確定として保持する。
- **最新レポートcommit**：本追記commit `39be802148e2aa3aed818274cd530e68890e9391` のActions [Run #38000559791](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000559791) も完了まで追跡する。job完了表示だけでrun全体の最終状態を代替しない。
- **現時点の品質状態**：26件のデータレコードと対応する個別値アサーションを追加。二次情報24件は引き続き未検証ラベルを保持。公式ページ照合済みは2件のみ。MVPは未完成。


## 最終CI結果更新（2026-10-10・26食品データ）
- **PASS**：テストcommit `ce6a8d263926a66ce35d8a737a7d05c893e98ec5` の [Run #38000542751](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000542751) は `completed / success`。JavaScript syntax、Nutrition and backup validation tests、JSON validation、全後処理ステップ成功。
- **PASS**：QAレポート追記commit `39be802148e2aa3aed818274cd530e68890e9391` の [Run #38000559791](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000559791) は `completed / success`。全step成功。
- **PASS**：Recovery状況追記commit `127404068cf887372df0a8883facfbe8d4214fbc` の [Run #38000612123](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000612123) は `completed / success`。ジョブ `validate` と JavaScript syntax、Nutrition and backup validation tests、JSON validation、全後処理ステップ成功。
- **FAILを保持**：食品データcommit `d6d673f6988d347e3d43d7a5331cbef023f8c937` の [Run #38000529805](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000529805) は件数テスト期待値の更新漏れにより失敗。後続テストcommitで期待値26へ修正し、その後のRun #38000542751とRun #38000559791、Run #38000612123は成功。失敗履歴は削除せずRecovery記録として保持する。
- **最新レポート追記CI**：本追記commitのActions runを確認し、completed/successとなるまで当該commitのCI PASSを宣言しない。


## 果物・加工食品・穀類データ追加（2026-10-10）
- **指定run追跡完了**：QAレポート更新commit `82bd9c5fcf8dbfbddb54f064471598b164ab3b99` の [Run #38000686148](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000686148) は `completed / success`。job `validate`（ID `114057732179`）と JavaScript syntax、Nutrition and backup validation tests、JSON validation、後処理を含む全stepが成功。これによりrun本体の最終状態も確認済み。
- **現在のデータ件数**：34件。公式個別ページとの照合済み2件、二次情報のみ32件。二次情報のレコードは `SECONDARY_SOURCE_UNVERIFIED`、`secondaryCheck=NOT_CHECKED`、`errataStatus=NOT_ROW_CHECKED` を保持。
- **今回の新規採用7件＋果物1件（100gあたり kcal / たんぱく質g / 炭水化物g / 脂質g）**：
  - トマト缶（ホール・食塩無添加、液汁を除く）06184：21 / 0.9 / 4.4 / 0.2。https://diet.relifeinc.jp/food/06184/
  - ボンレスハム 11175：115 / 18.7 / 1.8 / 4.0。https://diet.relifeinc.jp/food/11175/
  - ロースハム 11176：211 / 18.6 / 2.0 / 14.5。https://diet.relifeinc.jp/food/11176/
  - プロセスチーズ 13040：313 / 22.7 / 1.3 / 26.0。https://diet.relifeinc.jp/food/13040/
  - 食パン 01026：248 / 8.9 / 46.4 / 4.1。https://diet.relifeinc.jp/food/01026/
  - ホットケーキミックス 01024：360 / 7.8 / 74.4 / 4.0。https://diet.relifeinc.jp/food/01024/
  - 春巻きの皮（生）01179：288 / 8.3 / 62.2 / 1.6。https://diet.relifeinc.jp/food/01179/
  - りんご（皮つき・生）07176：56 / 0.2 / 16.2 / 0.3。https://eiyouseibun.sakura.ne.jp/nutrition_detail.php?NUTRITION_ID=1059&page=106
- **値の採用基準**：エネルギー・たんぱく質・炭水化物・脂質が出典ページに明記されている場合のみ登録。きな粉（04029）は検索結果で4項目すべてを同時確認できず、推測混入を避けるためデータセットから除外。栄養値を推定補完しない。
- **不一致管理**：出典ページ内に調理状態別の異なる値がある場合、状態が違う値は混ぜず別レコード候補として扱う。同一食品状態の複数出典による独立照合は今回未実施のため、競合値を確定・解消したとは扱わない。
- **自動テスト**：`official-foods.test.js` に上記8件の食品番号・出典URL・栄養値・未検証状態の個別アサーションを追加。件数期待値を34件（公式照合2＋二次情報32）へ更新。各更新commitのActionsを個別に追跡し、失敗があれば理由を記録して後続commitで修正する。
- **未解決ゲート**：果物カバレッジはりんご1件にとどまる。バナナ・柑橘類、調味料、追加加工食品の拡張、公式CSVの実取得・解析、正誤表行単位照合、同一食品状態の複数出典比較、網羅性・大規模整合性QA、iPhone実機Safari／ホーム画面追加／オフライン復帰・再接続、HTTPS公開は未完了。MacroPilot MVPは**未完成**。
- **保護境界**：変更先は `feature/macropilot-mvp` の `macropilot/official-foods.json`、`macropilot/official-foods.test.js`、`macropilot/QA_REPORT.md` のみ。main、baseline/pwa-foundation-v1.0、Canonical OSリポジトリは変更していない。


## 34件データ拡張後のCI追跡・Recovery完了（2026-10-10）
- **指定された旧run**：`82bd9c5fcf8dbfbddb54f064471598b164ab3b99` の [Run #38000686148](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38000686148) は `completed / success`。validateジョブと全step成功を確認。
- **拡張中の失敗記録**：
  - データ追加commit `443798c6474409d0f73ebeefb47a6a05fd16d493` の [Run #38001010200](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001010200) は旧期待件数26のため失敗（実データ34）。
  - 推測値を根拠にしないためきな粉を除外したcommit `c71a0afaf0389cf0660c309bde80a53e6b3754e5` の [Run #38001036229](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001036229) は旧期待件数26のため失敗（実データ33）。
  - りんご追加commit `283ef9642621b5d44f7564536e0114bf721f0afc` の [Run #38001075985](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001075985) は期待件数33の更新漏れで失敗（実データ34）。
  - 上記は食品値の不一致ではなく、データ件数とテスト期待値の更新順による失敗。失敗履歴は保持。
- **修正後PASS**：`official-foods.test.js` の期待値を34件（公式照合2＋二次情報32）へ更新したcommit `a39d85e64aa54397230ef4e4fea0a8cdfb96a03b` の [Run #38001090831](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001090831) は `completed / success`。JavaScript syntax、栄養・バックアップテスト、JSON検証、全後処理ステップ成功。
- **QAレポートcommit CI PASS**：本レポート更新commit `18fd90002f367b23dd4f96657bc8ed1c58497e62` の [Run #38001106982](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001106982) は `completed / success`。validateジョブと全step成功。
- **出典と値の確認範囲**：新規追加の各栄養値は出典ページに記載された100g値を記録。りんご（皮つき・生）は二次情報サイトSeibun!の100g表示を参照。きな粉は主要4値の出典表示を十分確認できなかったため、レコードを除外しており、現在の34件には含まれない。
- **現在のデータ品質**：34件、公式個別ページ照合済み2件、二次情報のみ32件。二次情報32件は `SECONDARY_SOURCE_UNVERIFIED` のまま。独立した同一食品状態の複数出典照合は未実施であり、出典間競合が不存在とは結論しない。
- **未解決ゲート**：果物はりんご1件のみで、バナナ・柑橘類の追加が必要。調味料の追加、公式CSV実取得・解析、正誤表行単位照合、同一食品状態の複数出典比較、網羅性・大規模整合性QA、iPhone実機Safari／ホーム画面追加／オフライン復帰・再接続、HTTPS公開は未完了。MacroPilot MVPは**未完成**。


## 38食品への拡張とCI追跡（2026-10-10）
- **指定run最終確認**：QAレポート更新commit `c8ba5b4de4916640f8531c67ea3a440faf39fcb4` の [Run #38001182100](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001182100) は `completed / success`。validate job（ID `114059352956`）と全step（Set up job、Checkout、Setup Node.js、JavaScript syntax、Nutrition and backup validation tests、JSON validation、post setup-node、post checkout、Complete job）がすべて `completed / success`。
- **追加食品4件**（すべて100gあたり、順序：kcal / たんぱく質g / 炭水化物g / 脂質g）：
  - バナナ（生）07107：93 / 1.1 / 22.5 / 0.2。Seibun!の100g表示を参照。https://eiyouseibun.sakura.ne.jp/nutrition_detail.php?NUTRITION_ID=1018&page=102
  - うんしゅうみかん（砂じょう・普通・生）07029：49 / 0.7 / 11.5 / 0.1。Seibun!の100g表示を参照。https://eiyouseibun.sakura.ne.jp/nutrition_detail.php?NUTRITION_ID=920&page=92
  - こいくちしょうゆ 17007：76 / 7.7 / 7.9 / 0.0。Seibun!の100g表示を参照。https://eiyouseibun.sakura.ne.jp/nutrition_detail.php?NUTRITION_ID=2343&page=235
  - 米みそ（淡色辛みそ）17045：182 / 12.5 / 21.9 / 6.0。Seibun!の100g表示を参照。https://eiyouseibun.sakura.ne.jp/nutrition_detail.php?NUTRITION_ID=2431&page=244
- **ステータス境界**：4件とも `SECONDARY_SOURCE_UNVERIFIED`、`secondaryCheck=NOT_CHECKED`、`errataStatus=NOT_ROW_CHECKED`。出典ページに明記された4栄養値のみ登録し、公式個別ページ照合済みとは扱っていない。
- **件数とテスト**：データは38件（公式個別ページ照合済み2件＋未検証二次情報36件）。`official-foods.test.js` に4件それぞれの食品番号、URL、4栄養値、未検証状態を検査する期待値を追加し、総件数を38へ更新。データcommit `2ea2ac31b6034a1273deeb726eb0278a1ee1139f`、テストcommit `b64ce2a2acbedd813cced73c5f1a62380ebbda1c`。
- **出典差異の扱い**：Seibun!では「うんしゅうみかん・砂じょう・早生」と「普通」は別の食品状態・食品番号として掲載され、値も異なるため、状態を混在させず普通の値のみ採用。これは同一食品状態の出典間矛盾と断定しない。今回、同一食品状態の独立した複数出典比較は未実施であり、競合値が不存在とは結論しない。
- **未解決ゲート**：公式CSVの実取得・解析、2026-03-27正誤表の行単位照合、同一食品状態での複数出典比較、データセット網羅性・大規模整合性QA、追加果物・調味料・加工食品の拡張、iPhone実機Safari／ホーム画面追加／オフライン復帰・再接続、HTTPS公開は未完了。MacroPilot MVPは**未完成**。
- **保護境界**：更新先は `feature/macropilot-mvp` の食品JSON、テスト、QAレポートのみ。main、baseline/pwa-foundation-v1.0、Canonical OSリポジトリは変更しない。今回のデータcommit、テストcommit、QAレポートcommitのActionsをそれぞれ完了まで追跡し、各run本体の最終状態と全stepを記録する。


## 38食品バッチのActions結果追記（2026-10-10）
- **データcommitの失敗を記録**：`2ea2ac31b6034a1273deeb726eb0278a1ee1139f` の [Run #38001512054](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001512054) は `completed / failure`。job `validate`（ID `114060425941`）。JavaScript syntaxは成功したが、Nutrition and backup validation tests内の `official-foods.test.js` が旧期待件数34と実データ38の不一致（`38 !== 34`）で失敗し、JSON validationはskip。栄養値そのものの不一致を示す失敗ではなく、データcommitと件数テスト更新を別commitに分けたことによる一時的な件数期待値の更新漏れ。ログを確認済み。
- **修正commit**：`b64ce2a2acbedd813cced73c5f1a62380ebbda1c` は4食品の個別期待値と件数38へ更新。対応する [Run #38001526568](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001526568) は最終照会時点で `in_progress`、job `validate`（ID `114060472858`）のJavaScript syntaxは成功、Nutrition and backup validation testsが実行中で、JSON validationと後処理はpending。run本体の結論は未確定として保持し、完了前にPASSとは扱わない。
- **QAレポートcommitのActions**：この追記commit `e4985308054a66af1ba65d2f291aa4ba8ebd6509` の [Run #38001545451](https://github.com/tamatamax-84/pwa-prototype-public/actions/runs/38001545451) は `completed / success`。job `validate`（ID `114060534590`）およびJavaScript syntax、Nutrition and backup validation tests、JSON validation、post setup-node、post checkout、Complete jobの全stepが成功。
- **食品状態と競合値**：普通うんしゅうみかん（07029）と早生うんしゅうみかん（07028）は出典で異なる食品番号・状態として掲載され、値が異なる。別状態として扱い、普通のレコードに早生の値を混ぜていない。同一状態の複数ソース照合はまだ実施していないため、未解決の出典競合はUNKNOWNとして扱う。
- **データ現状**：38件、公式個別ページ照合済み2件、未検証二次情報36件。追加4件はすべて `SECONDARY_SOURCE_UNVERIFIED` のまま。MVPは未完成。
