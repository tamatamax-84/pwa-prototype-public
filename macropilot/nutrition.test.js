// Arithmetic acceptance test for the prototype's formula (run: node nutrition.test.js)
const assert=require('node:assert/strict');
const n=(food,amount)=>{const x=amount/food.base;return {kcal:food.kcal*x,p:food.p*x,c:food.c*x,f:food.f*x}};
const chicken={base:100,kcal:165,p:31,c:0,f:3.6};
const rice={base:150,kcal:234,p:3.8,c:55.7,f:.5};
assert.deepEqual(n(chicken,150),{kcal:247.5,p:46.5,c:0,f:5.4});
assert.deepEqual(n(rice,300),{kcal:468,p:7.6,c:111.4,f:1});
console.log('PASS: 2 nutrition scaling arithmetic tests');