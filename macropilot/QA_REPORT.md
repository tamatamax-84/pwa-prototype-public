# MacroPilot MVP QA Report

## Scope and branch safety
- Working branch: feature/macropilot-mvp in tamatamax-84/pwa-prototype-public.
- Main and baseline/pwa-foundation-v1.0 are protected; verified SHA snapshots for main and baseline index.html/app.js/manifest.json match the known foundation SHAs at the start of this QA cycle.
- Canonical OS was loaded from tamatamax-84/AI-TEAM-NEXUS, main, OS/AI_TEAM_HQ_OS.md; verified OS_NAME=AI TEAM HQ OS, VERSION=v3.0 Compact, STATUS=ACTIVE, CANONICAL=YES. No OS repository writes were made.

## PASS
- GitHub Actions run 37965467879 succeeded for commit c7cdaf746b54b04b2c2b104f5e05875c64ecd229: JavaScript syntax, nutrition tests, PWA static checks, official-foods provenance tests, Playwright Chromium browser integration, and JSON parsing. A subsequent commit only corrected the official-food test's printed assertion count; its CI run is being checked separately.
- Browser integration test covers goal save/reload persistence, meal add/reload/delete, date rollover, backup export/import, Service Worker control, offline shell reload, and online recovery in a simulated Chromium context.
- Two official food rows were imported from the MEXT Food Composition Database, which indicates it is updated for the 2026-03-27 errata: rice (food no. 01088) and roasted skinless chicken breast (food no. 11288). Food number, cooking state, kcal/P/carbohydrate/fat, edition, source URL, and verification date are stored in official-foods.json and recorded in app.js.
- PWA manifest declares standalone display and scope, index has a viewport meta tag, and Service Worker precaches the core shell assets.

## FAIL / NEEDS FIX
- No current automated failure recorded in the last successful CI run. No current automated failure recorded in the successful run. The final assertion-count-only commit is pending its own CI confirmation at the time of this report.

## NOT EXECUTED / NOT VERIFIED
- The official MEXT Excel workbook and 2026-03-27 errata XLSX could not be downloaded and parsed in this environment; row-level Excel-to-database reconciliation is incomplete. The two official records were verified from the MEXT database individual food pages instead.
- Real iPhone/Safari hardware QA, Add to Home Screen flow, iOS background/foreground lifecycle, and real device offline recovery have not been executed. Chromium tests are automated browser simulation only.
- Live HTTPS deployment at a public MacroPilot URL was not performed or verified in this cycle.
- The remaining nine foods in app.js remain prototype-only estimates and are not official data.
- New standalone repository creation is unavailable in the current GitHub tool surface; MacroPilot remains an explicitly identified feature branch in pwa-prototype-public, not an independent repository.

## Official sources
- MEXT food composition table and errata page: https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html
- MEXT food database update notice: https://fooddb.mext.go.jp/
- Rice, food no. 01088: https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7
- Roasted skinless chicken breast, food no. 11288: https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7
