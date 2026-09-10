
function setLang(lang){
  document.documentElement.lang=lang;
  localStorage.setItem('h64lang',lang);
  document.querySelectorAll('[data-no][data-en]').forEach(el=>{ el.textContent=el.dataset[lang]; });
  document.querySelectorAll('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}
document.querySelectorAll('.lang').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
const mb=document.getElementById('menuBtn'), nav=document.getElementById('nav');
if(mb&&nav){mb.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
setLang(localStorage.getItem('h64lang')||'no');
