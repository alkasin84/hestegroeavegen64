/* Guest-link attribution. Only a validated reference is sent; no other query data. */
(()=>{
  const page=new URL(location.href);
  const names=['index.html','before.html','arrival.html','cabin.html','checkout.html','area.html','contact.html','ski.html','rules.html'];
  const filename=page.pathname.split('/').pop()||'index.html';
  const base=page.pathname.slice(0,page.pathname.lastIndexOf('/')+1);
  const raw=page.searchParams.get('ref');
  const ref=/^(?:[A-Za-z][A-Za-z-]{0,31}-)?\d{6,12}$/.test(raw||'')?raw:'';
  const key='h64-analytics-excluded';
  let excluded=false;
  try{excluded=localStorage.getItem(key)==='1';}catch{}
  if(ref) document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href || href.startsWith('#'))return;
    const u=new URL(href,page);
    if(u.origin!==page.origin || !u.pathname.startsWith(base))return;
    const name=u.pathname.slice(base.length)||'index.html';
    if(!names.includes(name))return;
    u.searchParams.set('ref',ref);
    a.href=u.href;
  });
  let storageFailed=false, scriptStarted=false, counted=false;
  const buttons=document.querySelectorAll('[data-analytics-disable]');
  const copy={
    no:['Besøksmåling i denne nettleseren','På','Av','Valget kunne ikke lagres. Det gjelder bare denne siden.'],
    en:['Visit measurement in this browser','On','Off','Your choice could not be saved. It applies only to this page.'],
    de:['Besuchsmessung in diesem Browser','An','Aus','Die Auswahl konnte nicht gespeichert werden. Sie gilt nur für diese Seite.']
  };
  function render(){
    const t=copy[document.documentElement.lang]||copy.no;
    buttons.forEach(b=>{
      ['no','en','de'].forEach(l=>b.removeAttribute('data-'+l));
      b.setAttribute('role','switch');b.setAttribute('aria-checked',String(!excluded));
      b.setAttribute('aria-label',t[0]);
      b.textContent=t[0]+': '+t[excluded?2:1];
    });
    document.querySelectorAll('[data-analytics-status]').forEach(el=>{
      el.textContent=storageFailed?t[3]:'';
    });
    document.querySelectorAll('[data-analytics-badge]').forEach(el=>{
      el.textContent=excluded?' · '+t[0]+': '+t[2]:'';
    });
  }
  function countPage(){
    if(excluded || counted || typeof window.goatcounter?.count!=='function')return;
    window.goatcounter.count();counted=true;
  }
  function start(){
    if(excluded || !names.includes(filename) || !['https:','http:'].includes(page.protocol))return;
    if(scriptStarted){countPage();return;}
    scriptStarted=true;
    const script=document.createElement('script');
    script.dataset.goatcounter='https://hestegroeavegen64.goatcounter.com/count';
    script.async=true;script.src='https://gc.zgo.at/count.js';
    script.onload=countPage;
    document.head.appendChild(script);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{
    excluded=!excluded;
    try{localStorage.setItem(key,excluded?'1':'0');storageFailed=false;}catch{storageFailed=true;}
    render();if(!excluded)start();
  }));
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('storage',e=>{
    if(e.key!==key && e.key!==null)return;
    try{excluded=localStorage.getItem(key)==='1';}catch{}
    render();if(!excluded)start();
  });
  window.addEventListener('pageshow',()=>{try{excluded=localStorage.getItem(key)==='1';}catch{}render();if(!excluded)start();});
  render();
  // Keep titles stable across guest languages. Ref is also searchable in the page path.
  const titles={'index.html':'Hjem','before.html':'Før turen','arrival.html':'Ankomst','cabin.html':'Under oppholdet','checkout.html':'Utsjekking','area.html':'Gausta','contact.html':'Kontakt','ski.html':'Ski inn/ut','rules.html':'Husregler'};
  window.goatcounter={
    path:base+filename+(ref?'?ref='+ref:''),
    title:titles[filename]+(ref?' · ref '+ref:''),
    referrer:ref?'ref-'+ref:'',
    no_events:true,
    no_onload:true
  };
  start();
})();
