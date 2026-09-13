
function readPreference(key){try{return localStorage.getItem(key);}catch{return null;}}
function savePreference(key,value){try{localStorage.setItem(key,value);}catch{}}
const supportedLanguages=['no','en','de'];
const savedLanguage=readPreference('h64lang');
let currentLang = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'no';
let currentSeason = readPreference('h64season') === 'summer' ? 'summer' : 'winter';

function updateSeasonCopy(){
  document.querySelectorAll('.season-copy').forEach(el=>{
    const key = `${currentSeason}${currentLang[0].toUpperCase()+currentLang.slice(1)}`;
    if(el.dataset[key]) el.textContent = el.dataset[key];
  });
}
function updatePageTitle(){
  const heading=document.querySelector(currentSeason==='summer'?'h1.summer-only':'h1.winter-only')||document.querySelector('h1');
  if(heading) document.title=heading.textContent+' · '+(currentLang==='de'?'Gästeinformationen':currentLang==='en'?'Guest information':'Gjesteinformasjon');
}
function setLang(lang){
  if(!supportedLanguages.includes(lang)) return;
  currentLang=lang;
  document.documentElement.lang=lang;
  savePreference('h64lang',lang);
  document.querySelectorAll('[data-no][data-en]').forEach(el=>el.textContent=el.dataset[lang]);
  document.querySelectorAll('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  document.querySelectorAll('[data-alt-no][data-alt-en]').forEach(el=>el.alt=el.dataset['alt'+lang[0].toUpperCase()+lang.slice(1)]);
  document.querySelectorAll('[data-aria-no][data-aria-en]').forEach(el=>el.setAttribute('aria-label',el.dataset['aria'+lang[0].toUpperCase()+lang.slice(1)]));
  document.querySelectorAll('.lang').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
  updateSeasonCopy();
  updatePageTitle();
}
function setSeason(season){
  currentSeason=season;
  document.querySelectorAll('.season-btn').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.season===season)));
  document.documentElement.dataset.season=season;
  savePreference('h64season',season);
  document.querySelectorAll('.season-btn').forEach(b=>b.classList.toggle('active',b.dataset.season===season));
  updateSeasonCopy();
  updatePageTitle();
}
document.querySelectorAll('.lang').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
document.querySelectorAll('.season-btn').forEach(b=>b.addEventListener('click',()=>setSeason(b.dataset.season)));
const mb=document.getElementById('menuBtn'),nav=document.getElementById('nav');
if(mb&&nav){
  mb.addEventListener('click',()=>{const open=nav.classList.toggle('open');mb.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false');}));
}
setSeason(currentSeason);
setLang(currentLang);

// Keep checkmarks when visiting another page; expire after a day for the next stay.
const checkoutBoxes=Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));
const checkoutKey='h64checkout-v1';
if(checkoutBoxes.length){
  try{
    const saved=JSON.parse(readPreference(checkoutKey)||'null');
    if(saved && Array.isArray(saved.checked) && Date.now()-saved.updated<86400000){
      checkoutBoxes.forEach((box,i)=>box.checked=saved.checked[i]===true);
    }
  }catch{}
  const saveChecks=()=>savePreference(checkoutKey,JSON.stringify({updated:Date.now(),checked:checkoutBoxes.map(box=>box.checked)}));
  checkoutBoxes.forEach(box=>box.addEventListener('change',saveChecks));
  document.getElementById('reset-checklist')?.addEventListener('click',()=>{checkoutBoxes.forEach(box=>box.checked=false);saveChecks();});
}
