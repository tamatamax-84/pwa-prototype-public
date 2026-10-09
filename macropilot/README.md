# MacroPilot MVP Prototype

This is an isolated feature branch based on the frozen PWA Foundation v1.0 commit. The protected `baseline/pwa-foundation-v1.0` branch and `main` are unchanged.

## Prototype scope
- User-set daily kcal and PFC targets (bulk/cut/maintain labels)
- Selectable food entries and portion-scaled nutrition arithmetic
- Daily log and saved-on-device storage
- Sample recipes with ingredient-derived totals
- JSON backup/export and restore
- PWA manifest and offline shell cache

## Nutrition core and test
- `nutrition-core.js` is the shared calculation/validation module used by the app and Node test.
- Run `node nutrition.test.js` in an environment with Node.js to exercise arithmetic, aggregation, remaining targets, and backup validation.
- `food-data.schema.json` defines required provenance fields. Current `app.js` food rows remain `SAMPLE_UNVERIFIED`; they are not yet official MEXT values.

## Important data limitation
The bundled foods are illustrative sample values for prototype behavior, not a full verified import of the Ministry of Education, Culture, Sports, Science and Technology (MEXT) Standard Tables of Food Composition in Japan. Before real-world nutrition use, import/verify source food records and retain food-state, units, provenance, and source edition. MEXT says food-composition data may be reused in apps with attribution: https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html

The MEXT page lists the 2026-03-27 errata (令和8年3月27日付正誤表). The official Food Composition Database states it incorporated that errata on 2026-06-09. Check the errata before importing records: https://fooddb.mext.go.jp/

This prototype is not medical advice and does not calculate individualized clinical nutrition prescriptions.

## Deployment
Publish the `macropilot/` directory through HTTPS to use Service Worker/PWA functionality. This branch is not yet an independent repository or published app.