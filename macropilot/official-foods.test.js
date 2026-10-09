const assert=require('node:assert/strict');
const fs=require('node:fs');
const foods=JSON.parse(fs.readFileSync('official-foods.json','utf8'));
assert.equal(foods.length,2);
const rice=foods.find(f=>f.id==='rice');assert.equal(rice.provenance.foodNumber,'01088');assert.equal(rice.nutrients.energyKcal,156);assert.equal(rice.nutrients.carbohydrateG,37.1);
const chicken=foods.find(f=>f.id==='chicken');assert.equal(chicken.provenance.foodNumber,'11288');assert.equal(chicken.nutrients.energyKcal,177);assert.equal(chicken.nutrients.proteinG,38.8);assert.equal(chicken.nutrients.fatG,3.3);
for(const f of foods){assert.equal(f.provenance.status,'OFFICIAL_VERIFIED');assert.ok(f.provenance.sourceUrl.startsWith('https://fooddb.mext.go.jp/'));assert.ok(f.provenance.foodState);assert.equal(f.base,100)}
console.log('PASS: 11 official food provenance and nutrient assertions');
