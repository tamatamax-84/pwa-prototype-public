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
  if (p.status === 'OFFICIAL_PAGE_SECONDARY_MATCH' || p.status === 'OFFICIAL_PAGE_ONLY' || p.status === 'CSV_ROW_VERIFIED') {
    assert.ok(p.sourceUrl.startsWith('https://fooddb.mext.go.jp/details/'), food.id + ': official individual page required for verified status');
  } else {
    assert.ok(p.status === 'SECONDARY_SOURCE_UNVERIFIED', food.id + ': unverified records must be explicitly labeled');
    assert.ok(/^https:\/\//.test(p.sourceUrl), food.id + ': secondary source URL required');
    assert.ok(p.secondarySources.includes(p.sourceUrl), food.id + ': source URL must be retained in provenance');
    assert.equal(p.secondaryCheck, 'NOT_CHECKED', food.id + ': unverified secondary data must not claim a match');
  }
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
  assert.ok(['OFFICIAL_PAGE_SECONDARY_MATCH','OFFICIAL_PAGE_ONLY','CSV_ROW_VERIFIED','SAMPLE_UNVERIFIED','SECONDARY_SOURCE_UNVERIFIED'].includes(food.provenance.status), food.id + ': recognized evidence status');
  if (food.provenance.errataStatus !== 'ROW_CHECKED' && food.provenance.errataStatus !== 'NOT_APPLICABLE') assert.notEqual(food.provenance.errataStatus,'ROW_CHECKED',food.id + ': errata must not be marked checked without row evidence');
}
const expectedSecondary = {
  tofu_momen: {number:'04032', energyKcal:73, proteinG:7.0, carbohydrateG:1.5, fatG:4.9, url:'https://diet.relifeinc.jp/food/04032/'},
  natto: {number:'04046', energyKcal:184, proteinG:16.5, carbohydrateG:12.1, fatG:10.0, url:'https://diet.relifeinc.jp/food/04046/'},
  broccoli_raw: {number:'06263', energyKcal:37, proteinG:5.4, carbohydrateG:6.6, fatG:0.6, url:'https://diet.relifeinc.jp/food/06263/'},
  tuna_water_canned: {number:'10260', energyKcal:70, proteinG:16.0, carbohydrateG:0.2, fatG:0.7, url:'https://diet.relifeinc.jp/food/10260/'},
  sweet_potato_steamed_peeled: {number:'02007', energyKcal:131, proteinG:1.2, carbohydrateG:31.9, fatG:0.2, url:'https://diet.relifeinc.jp/food/02007/'},
  soy_milk_unadjusted: {number:'04052', energyKcal:43, proteinG:3.6, carbohydrateG:2.3, fatG:2.8, url:'https://diet.relifeinc.jp/food/04052/'},
  soybean_dry_domestic: {number:'04023', energyKcal:372, proteinG:33.8, carbohydrateG:29.5, fatG:19.7, url:'https://diet.relifeinc.jp/food/04023/'}
};
for (const [id, expected] of Object.entries(expectedSecondary)) {
  const food = foods.find(f => f.id === id);
  assert.ok(food, id + ': sourced secondary record exists');
  assert.equal(food.provenance.status, 'SECONDARY_SOURCE_UNVERIFIED');
  assert.equal(food.provenance.foodNumber, expected.number);
  assert.equal(food.provenance.sourceUrl, expected.url);
  assert.deepEqual(food.nutrients, {energyKcal:expected.energyKcal,proteinG:expected.proteinG,carbohydrateG:expected.carbohydrateG,fatG:expected.fatG});
  assert.equal(food.provenance.errataStatus,'NOT_ROW_CHECKED');
  assert.equal(food.provenance.secondaryCheck,'NOT_CHECKED');
}
assert.equal(foods.length,9,'expected two previously verified records plus seven secondary-source records');
console.log('PASS: ' + foods.length + ' food records validated; 2 official-page-checked records and 7 explicitly unverified secondary-source records, with exact nutrients/provenance and no false verification status');
