const DB='macropilot-v1';
const Nutrition=window.MacroNutrition;
const localISODate=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const foods=[
{id:'rice',name:'ご飯（炊飯後）',emoji:'🍚',unit:'g',base:150,kcal:234,p:3.8,c:55.7,f:.5},
{id:'chicken',name:'鶏むね肉（皮なし・加熱）',emoji:'🍗',unit:'g',base:100,kcal:165,p:31,c:0,f:3.6},
{id:'egg',name:'卵',emoji:'🥚',unit:'個',base:1,kcal:76,p:6.2,c:.2,f:5.2},
{id:'natto',name:'納豆',emoji:'🫘',unit:'パック',base:1,kcal:90,p:7.4,c:5.4,f:4.5},
{id:'tofu',name:'木綿豆腐',emoji:'◻️',unit:'g',base:150,kcal:110,p:10.5,c:2.1,f:6.3},
{id:'salmon',name:'鮭（焼き）',emoji:'🐟',unit:'g',base:100,kcal:180,p:25.2,c:.1,f:8.5},
{id:'banana',name:'バナナ',emoji:'🍌',unit:'本',base:1,kcal:93,p:1.1,c:22.5,f:.2},
{id:'yogurt',name:'プレーンヨーグルト',emoji:'🥣',unit:'g',base:100,kcal:62,p:3.6,c:4.9,f:3},
{id:'oats',name:'オートミール（乾）',emoji:'🌾',unit:'g',base:40,kcal:140,p:5.5,c:27.6,f:2.4},
{id:'broccoli',name:'ブロッコリー（ゆで）',emoji:'🥦',unit:'g',base:100,kcal:30,p:3.5,c:5.2,f:.4},
{id:'protein',name:'プロテイン（標準例）',emoji:'🥛',unit:'回',base:1,kcal:120,p:24,c:3,f:2}
];
// Prototype-only approximations; not a verified complete MEXT import.
const recipes=[
{id:'r1',name:'鶏むね肉プレート',emoji:'🍱',time:'15分',desc:'鶏むね肉・ご飯・ブロッコリー',ingredients:[['chicken',150],['rice',180],['broccoli',100]],steps:['鶏肉を中心まで十分に加熱する。','ご飯とブロッコリーを添える。']},
{id:'r2',name:'鮭とご飯',emoji:'🐟',time:'12分',desc:'鮭・ご飯・ブロッコリー',ingredients:[['salmon',100],['rice',150],['broccoli',100]],steps:['鮭を中心まで加熱する。','ご飯とブロッコリーを盛り付ける。']},
{id:'r3',name:'オートミールヨーグルト',emoji:'🥣',time:'5分',desc:'オートミール・ヨーグルト・バナナ',ingredients:[['oats',40],['yogurt',100],['banana',1]],steps:['オートミールとヨーグルトを混ぜる。','バナナを切ってのせる。']},
{id:'r4',name:'納豆たまごご飯',emoji:'🍚',time:'5分',desc:'ご飯・納豆・卵',ingredients:[['rice',150],['natto',1],['egg',1]],steps:['卵は安全に取り扱い、必要に応じて加熱する。','ご飯に納豆と卵を添える。']}
];
const defaults={goals:{type:'bulk',kcal:2200,p:140,c:250,f:60,configured:false},logs:[],meal:'朝食',date:localISODate()};
let state=(()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(DB)),goals:{...defaults.goals,...(JSON.parse(localStorage.getItem(DB))||{}).goals}}}catch{return structuredClone(defaults)}})();
const $=id=>document.getElementById(id),round=n=>Math.round(n*10)/10,fmt=n=>Math.round(n).toLocaleString('ja-JP');
function save(){localStorage.setItem(DB,JSON.stringify(state))}
function n(food,amount){return Nutrition.scale(food,amount)}
function total(logs=state.logs){return Nutrition.sum(logs,foods,'food','amount')}
function safe(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function recipeTotal(r){return Nutrition.sum(r.ingredients.map(([food,amount])=>({food,amount})),foods,'food','amount')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}
function render(){
 const d=localISODate();if(state.date!==d){state.date=d;state.logs=[];save()}
 const t=total(),g=state.goals;$('date').textContent=new Date().toLocaleDateString('ja-JP',{month:'long',day:'numeric',weekday:'short'});$('mode').textContent={bulk:'増量モード',cut:'減量モード',maintain:'維持モード'}[g.type];$('notice').hidden=g.configured;
 $('kcal').textContent=fmt(t.kcal);$('kgoal').textContent=fmt(g.kcal);$('kleft').textContent=fmt(g.kcal-t.kcal);$('kbar').style.width=Math.min(100,t.kcal/g.kcal*100)+'%';
 for(let k of ['p','c','f']){$(k).textContent=fmt(t[k]);$('g'+k).textContent=fmt(g[k]);$('l'+k).textContent=fmt(g[k]-t[k]);$('b'+k).style.width=Math.min(100,t[k]/Math.max(1,g[k])*100)+'%'}
 $('foodList').innerHTML=foods.map(f=>{let v=n(f,f.base);return `<button class="food" data-food="${f.id}"><span>${f.emoji}</span><b>${safe(f.name)}<small>${fmt(v.kcal)} kcal / ${f.base}${f.unit}</small></b></button>`}).join('');
 $('logs').innerHTML=state.logs.length?state.logs.map(l=>{let f=foods.find(x=>x.id===l.food),v=n(f,l.amount);return `<div class="log"><span>${f.emoji}</span><div><b>${safe(f.name)}</b><small>${safe(l.meal)} · ${l.amount}${f.unit} · P ${round(v.p)} / C ${round(v.c)} / F ${round(v.f)}g</small></div><strong>${fmt(v.kcal)} kcal</strong><button data-del="${l.id}">×</button></div>`}).join(''):'<p class="empty">まだ記録がありません。食材を選んで追加できます。</p>';
 $('recipes').innerHTML=recipes.map(r=>{let v=recipeTotal(r);return `<article class="recipe"><span class="art">${r.emoji}</span><div><b>${r.name}</b><small>${r.desc} · ${r.time}</small><p>${fmt(v.kcal)} kcal · P ${round(v.p)}g / C ${round(v.c)}g / F ${round(v.f)}g</p><button data-detail="${r.id}">手順</button> <button class="accent" data-addrecipe="${r.id}">食事に追加</button></div></article>`}).join('');
 let rem=Math.max(0,g.p-t.p),r=recipes.map(x=>({...x,v:recipeTotal(x)})).sort((a,b)=>Math.abs(a.v.p-rem*.5)-Math.abs(b.v.p-rem*.5))[0];$('hint').innerHTML=`<b>${r.emoji} ${r.name}</b><p>タンパク質の残り目標を参考にした候補です。食材や調理方法によって栄養値は変わります。</p><strong>${fmt(r.v.kcal)} kcal · P ${round(r.v.p)}g / C ${round(r.v.c)}g / F ${round(r.v.f)}g</strong><p><button class="accent" data-addrecipe="${r.id}">この食事を記録</button></p>`;
}
function addFood(id){let f=foods.find(x=>x.id===id),amount=prompt(f.name+' の量（'+f.unit+'）',f.base);if(amount===null)return;amount=Number(amount);if(!Number.isFinite(amount)||amount<=0||amount>5000){toast('量を確認してください');return}state.logs.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),food:id,amount,meal:state.meal});save();render();toast('食事を記録しました')}
function addRecipe(id){let r=recipes.find(x=>x.id===id);r.ingredients.forEach(([food,amount])=>state.logs.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),food,amount,meal:state.meal}));save();render();toast('レシピの材料を記録しました')}
$('foodList').addEventListener('click',e=>{let b=e.target.closest('[data-food]');if(b)addFood(b.dataset.food)});
document.addEventListener('click',e=>{let del=e.target.closest('[data-del]');if(del){state.logs=state.logs.filter(l=>l.id!==del.dataset.del);save();render()}let add=e.target.closest('[data-addrecipe]');if(add)addRecipe(add.dataset.addrecipe);let det=e.target.closest('[data-detail]');if(det){let r=recipes.find(x=>x.id===det.dataset.detail);alert(r.name+'\n材料：'+r.ingredients.map(([id,a])=>foods.find(f=>f.id===id).name+' '+a).join('、')+'\n\n'+r.steps.join('\n'))}});
$('tabs').addEventListener('click',e=>{let b=e.target.closest('[data-meal]');if(!b)return;state.meal=b.dataset.meal;document.querySelectorAll('[data-meal]').forEach(x=>x.classList.toggle('active',x===b));save()});
function openGoals(){let g=state.goals;for(let k of ['kcal','p','c','f'])$('goal'+k).value=g[k];$('type').value=g.type;$('goals').showModal()}
$('settings').onclick=openGoals;$('edit').onclick=openGoals;$('setup').onclick=openGoals;$('close').onclick=()=> $('goals').close();
$('goalForm').addEventListener('submit',e=>{e.preventDefault();let g={type:$('type').value,kcal:Number($('goalkcal').value),p:Number($('goalp').value),c:Number($('goalc').value),f:Number($('goalf').value),configured:true};if(!Object.values(g).slice(1,5).every(x=>Number.isFinite(x)&&x>=0)){toast('目標値を確認してください');return}state.goals=g;save();$('goals').close();render();toast('目標を保存しました')});
$('clear').onclick=()=>{if(confirm('今日の記録をすべて削除しますか？')){state.logs=[];save();render()}};
$('export').onclick=()=>{let a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.href=u;a.download='macropilot-backup.json';a.click();URL.revokeObjectURL(u)};
$('import').onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Nutrition.validateBackup(x,foods.map(f=>f.id)))throw Error('invalid backup');state={...defaults,...x,goals:{...defaults.goals,...x.goals}};save();render();toast('復元しました')}catch{toast('バックアップを読み込めません')}e.target.value=''};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
