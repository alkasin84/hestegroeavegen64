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
  document.querySelectorAll('[data-analytics-disable]').forEach(b=>b.addEventListener('click',()=>{
    excluded=true;
    if(window.goatcounter)window.goatcounter.no_onload=true;
    try{localStorage.setItem(key,'1');location.reload();}catch{b.textContent=({no:'Måling stoppet for denne siden.',en:'Measurement stopped for this page.',de:'Messung für diese Seite gestoppt.'})[document.documentElement.lang]||'Measurement stopped.';}
  }));
  if(excluded || !names.includes(filename) || !['https:','http:'].includes(page.protocol))return;
  // Keep titles stable across guest languages. Ref is also searchable in the page path.
  const titles={'index.html':'Hjem','before.html':'Før turen','arrival.html':'Ankomst','cabin.html':'Under oppholdet','checkout.html':'Utsjekking','area.html':'Gausta','contact.html':'Kontakt','ski.html':'Ski inn/ut','rules.html':'Husregler'};
  window.goatcounter={
    path:base+filename+(ref?'?ref='+ref:''),
    title:titles[filename]+(ref?' · ref '+ref:''),
    referrer:ref?'ref-'+ref:'',
    no_events:true
  };
  const script=document.createElement('script');
  script.dataset.goatcounter='https://hestegroeavegen64.goatcounter.com/count';
  script.async=true;script.src='https://gc.zgo.at/count.js';
  document.head.appendChild(script);
})();
