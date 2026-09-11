
let currentLang = localStorage.getItem('h64lang') || 'no';
let currentSeason = localStorage.getItem('h64season') || 'winter';

function updateSeasonCopy(){
  document.querySelectorAll('.season-copy').forEach(el=>{
    const key = `${currentSeason}${currentLang==='no' ? 'No' : 'En'}`;
    if(el.dataset[key]) el.textContent = el.dataset[key];
  });
}
function setLang(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  localStorage.setItem('h64lang',lang);
  document.querySelectorAll('[data-no][data-en]').forEach(el=>el.textContent=el.dataset[lang]);
  document.querySelectorAll('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  updateSeasonCopy();
}
function setSeason(season){
  currentSeason=season;
  document.documentElement.dataset.season=season;
  localStorage.setItem('h64season',season);
  document.querySelectorAll('.season-btn').forEach(b=>b.classList.toggle('active',b.dataset.season===season));
  updateSeasonCopy();
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
