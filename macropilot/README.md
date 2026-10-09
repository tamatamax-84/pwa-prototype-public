# MacroPilot MVP Prototype

This is an isolated feature branch based on the frozen PWA Foundation v1.0 commit. The protected `baseline/pwa-foundation-v1.0` branch and `main` are unchanged.

## Prototype scope
- User-set daily kcal and PFC targets (bulk/cut/maintain labels)
- Selectable food entries and portion-scaled nutrition arithmetic
- Daily log and saved-on-device storage
- Sample recipes with ingredient-derived totals
- JSON backup/export and restore
- PWA manifest and offline shell cache

## Important data limitation
The bundled foods are illustrative sample values for prototype behavior, not a full verified import of the Ministry of Education, Culture, Sports, Science and Technology (MEXT) Standard Tables of Food Composition in Japan. Before real-world nutrition use, import/verify source food records and retain food-state, units, provenance, and source edition. MEXT says food-composition data may be reused in apps with attribution: https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html

This prototype is not medical advice and does not calculate individualized clinical nutrition prescriptions.

## Deployment
Publish the `macropilot/` directory through HTTPS to use Service Worker/PWA functionality. This branch is not yet an independent repository or published app.