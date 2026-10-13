(()=>{
 const field=document.getElementById('guest-link'),status=document.getElementById('link-status');
 const usedCodes=new Set();
 const key='h64-analytics-excluded',state=document.getElementById('exclude-status');
 let excluded=false;
 const toggle=document.getElementById('measurement-toggle');
 function refresh(){
  try{excluded=localStorage.getItem(key)==='1';
   toggle.setAttribute('aria-checked',String(!excluded));
   toggle.textContent='Besøksmåling i denne nettleseren: '+(excluded?'Av':'På');
   state.textContent=excluded?'Dine besøk på gjestesidene måles ikke. Trykk på knappen for å slå målingen på igjen.':'Dine besøk på gjestesidene kan bli telt. Trykk på knappen for å slå målingen av.';
  }catch{state.textContent='Nettleseren tillater ikke lagring av dette valget.';}
 }
 toggle.addEventListener('click',()=>{
  try{localStorage.setItem(key,excluded?'0':'1');refresh();}catch{state.textContent='Valget kunne ikke lagres. Innstillingen er ikke endret.';}
 });
 window.addEventListener('storage',e=>{if(e.key===key || e.key===null)refresh();});
 document.getElementById('new-link').addEventListener('click',()=>{
  const name=document.getElementById('guest-name').value.trim();
  const label=name.replace(/Æ/g,'Ae').replace(/æ/g,'ae').replace(/Ø/g,'O').replace(/ø/g,'o').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-');
  if(name && !/^[A-Za-z][A-Za-z-]{0,31}$/.test(label)){
    status.textContent='Bruk et kort fornavn eller kallenavn med bokstaver, mellomrom eller bindestrek (maks 32 tegn).';
    field.value='';return;
  }
  let code;
  do {
    const bytes=new Uint32Array(1);crypto.getRandomValues(bytes);
    code=(label?label+'-':'')+String(100000000+(bytes[0]%900000000));
  } while(usedCodes.has(code));
  usedCodes.add(code);
  const url=new URL('index.html',location.href);url.search='';url.hash='';url.searchParams.set('ref',code);
  field.value=url.href;status.textContent='Ny kode: '+code+'. Kopier og ta vare på lenken før du lager en ny.';
 });
 document.getElementById('copy-link').addEventListener('click',async()=>{
  if(!field.value){status.textContent='Lag en lenke først.';return;}
  try{await navigator.clipboard.writeText(field.value);status.textContent='Lenken er kopiert.';}catch{field.focus();field.select();status.textContent='Marker og kopier lenken manuelt.';}
 });
 window.addEventListener('pageshow',refresh);
 refresh();
})();
