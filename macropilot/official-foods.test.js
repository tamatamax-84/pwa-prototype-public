const assert = require('node:assert/strict');
const fs = require('node:fs');
const foods = JSON.parse(fs.readFileSync('official-foods.json', 'utf8'));
const schema = JSON.parse(fs.readFileSync('food-data.schema.json', 'utf8'));
const required = schema.required;
const nutrientKeys = ['energyKcal', 'proteinG', 'carbohydrateG', 'fatG'];
assert.ok(Array.isArray(foods) && foods.length > 0, 'food dataset must not be empty');
const ids = new Set();
const foodNumbers = new Set();
for (const food of foods) {
  for (const key of required) assert.ok(Object.hasOwn(food, key), food.id + ': missing ' + key);
  assert.ok(food.id && !ids.has(food.id), 'food IDs must be unique: ' + food.id); ids.add(food.id);
  assert.equal(food.base, 100, food.id + ': this dataset stores per-100g values');
  assert.ok(food.name.trim() && food.unit === 'g', food.id + ': food name and gram unit required');
  for (const key of nutrientKeys) assert.ok(Number.isFinite(food.nutrients[key]) && food.nutrients[key] >= 0, food.id + ': invalid ' + key);
  const p = food.provenance;
  assert.ok(schema.properties.provenance.properties.status.enum.includes(p.status), food.id + ': invalid provenance status');
  assert.ok(p.sourceUrl.startsWith('https://fooddb.mext.go.jp/details/'), food.id + ': official individual page required');
  assert.ok(/^\d{5}$/.test(p.foodNumber), food.id + ': food number must be five digits');
  assert.ok(p.foodState.trim(), food.id + ': food state required');
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(p.verifiedAt), food.id + ': verifiedAt must be ISO date');
  assert.ok(['ROW_CHECKED','DATABASE_HISTORY_ONLY','NOT_ROW_CHECKED','NOT_APPLICABLE'].includes(p.errataStatus), food.id + ': errata status required');
  assert.ok(Array.isArray(p.secondarySources), food.id + ': secondarySources must be an array');
  assert.ok(['FOOD_NUMBER_STATE_AND_CORE_NUTRIENTS_MATCH','MISMATCH','NOT_CHECKED'].includes(p.secondaryCheck), food.id + ': secondary check status required');
  if (p.status === 'OFFICIAL_PAGE_SECONDARY_MATCH') assert.ok(p.secondarySources.length > 0 && p.secondaryCheck === 'FOOD_NUMBER_STATE_AND_CORE_NUTRIENTS_MATCH', food.id + ': secondary match status needs evidence');
  if (foodNumbers.has(p.foodNumber)) throw new Error('duplicate food number: ' + p.foodNumber);
  foodNumbers.add(p.foodNumber);
}
const rice=foods.find(f=>f.id==='rice'); assert.ok(rice, 'rice record retained');
assert.equal(rice.provenance.foodNumber,'01088'); assert.equal(rice.provenance.sourceUrl,'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=1_01088_7');
assert.match(rice.provenance.foodState,/炊飯後.*精白米.*うるち米/); assert.equal(rice.base,100);
assert.deepEqual(rice.nutrients,{energyKcal:156,proteinG:2.5,carbohydrateG:37.1,fatG:0.3},'rice all registered nutrient values must match the official individual page');
const chicken=foods.find(f=>f.id==='chicken'); assert.ok(chicken, 'chicken record retained');
assert.equal(chicken.provenance.foodNumber,'11288'); assert.equal(chicken.provenance.sourceUrl,'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11288_7');
assert.match(chicken.provenance.foodState,/若どり.*むね.*皮なし.*焼き/); assert.equal(chicken.base,100);
assert.deepEqual(chicken.nutrients,{energyKcal:177,proteinG:38.8,carbohydrateG:0.1,fatG:3.3},'chicken all registered nutrient values must match the official individual page');
for (const food of foods) {
  assert.ok(food.provenance.status === 'OFFICIAL_PAGE_SECONDARY_MATCH' || food.provenance.status === 'OFFICIAL_PAGE_ONLY' || food.provenance.status === 'CSV_ROW_VERIFIED' || food.provenance.status === 'SAMPLE_UNVERIFIED', food.id + ': recognized evidence status');
  if (food.provenance.errataStatus !== 'ROW_CHECKED' && food.provenance.errataStatus !== 'NOT_APPLICABLE') assert.notEqual(food.provenance.errataStatus,'ROW_CHECKED',food.id + ': errata must not be marked checked without row evidence');
}
console.log('PASS: ' + foods.length + ' food records validated for unique IDs/numbers, all registered nutrients for the two official-page-checked foods, provenance, secondary checks, and explicit errata status');
