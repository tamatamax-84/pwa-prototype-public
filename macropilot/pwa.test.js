const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.json','utf8'));
const schema=JSON.parse(fs.readFileSync('food-data.schema.json','utf8'));
assert.ok(html.indexOf('nutrition-core.js')>=0 && html.indexOf('nutrition-core.js')<html.indexOf('app.js'),'nutrition core must load before app.js');
assert.ok(sw.includes("'./nutrition-core.js','./official-foods.json'"),'service worker cache list must include nutrition core');
for(const asset of ['./','./index.html','./style.css','./app.js','./manifest.json','./icon.svg','./nutrition-core.js']){const path=asset==='./'?'index.html':asset.slice(2);assert.ok(fs.existsSync(path),'missing offline asset '+asset);assert.ok(sw.includes("'"+asset+"'"),'offline asset missing from cache list '+asset)}
assert.equal(manifest.display,'standalone');assert.ok(manifest.start_url);assert.ok(Array.isArray(manifest.icons)&&manifest.icons.length>0);assert.ok(schema.properties.provenance.required.includes('status'));const official=JSON.parse(fs.readFileSync('official-foods.json','utf8'));assert.ok(official.length>0,'food dataset must not be empty');assert.ok(official.every(f=>f.provenance&&f.provenance.status&&f.provenance.errataStatus),'food provenance status fields required');assert.ok(fs.readFileSync('app.js','utf8').includes("fetch('./official-foods.json'"),'app must load the separate food data file');assert.ok(sw.includes("'./official-foods.json'"),'official food JSON must be cached for offline use');
console.log('PASS: PWA script order, offline asset references, manifest and provenance schema');
