(()=>{
 const field=document.getElementById('guest-link'),status=document.getElementById('link-status');
 const key='h64-analytics-excluded',state=document.getElementById('exclude-status');
 function refresh(){try{state.textContent=localStorage.getItem(key)==='1'?'Dine besøk telles ikke i denne nettleseren.':'Dine besøk kan bli telt i denne nettleseren.';}catch{state.textContent='Nettleseren tillater ikke lagring av dette valget.';}}
 document.getElementById('new-link').addEventListener('click',()=>{
  const bytes=new Uint32Array(1);crypto.getRandomValues(bytes);
  const code=String(100000000+(bytes[0]%900000000));
  const url=new URL('index.html',location.href);url.search='';url.hash='';url.searchParams.set('ref',code);
  field.value=url.href;status.textContent='Ny kode: '+code+'. Kopier og ta vare på lenken før du lager en ny.';
 });
 document.getElementById('copy-link').addEventListener('click',async()=>{
  if(!field.value){status.textContent='Lag en lenke først.';return;}
  try{await navigator.clipboard.writeText(field.value);status.textContent='Lenken er kopiert.';}catch{field.focus();field.select();status.textContent='Marker og kopier lenken manuelt.';}
 });
 document.getElementById('exclude').addEventListener('click',()=>{try{localStorage.setItem(key,'1');refresh();}catch{state.textContent='Valget kunne ikke lagres. Dine besøk kan fortsatt bli telt.';}});
 document.getElementById('include').addEventListener('click',()=>{try{localStorage.removeItem(key);refresh();}catch{state.textContent='Valget kunne ikke endres.';}});
 refresh();
})();
