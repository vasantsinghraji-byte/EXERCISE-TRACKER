/* Presentation and interaction layer. All summaries use saved user records. */
const UI = (() => {
  const $=id=>document.getElementById(id), esc=Habit.escape;
  const paths={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',chart:'<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',leaf:'<path d="M20 3C9 2 3 7 5 14s13 7 15-11ZM4 21 15 10"/>',shield:'<path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5zM8 12l3 3 5-6"/>',heart:'<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 0 9 8 15 8-6 12-11 8-15Z"/>',check:'<path d="m5 12 4 4L19 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',play:'<path d="m8 4 12 8-12 8z"/>',pause:'<path d="M8 5v14M16 5v14"/>',reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 11h18m-13 5h2m4 0h2"/>',list:'<path d="M9 5h12M9 12h12M9 19h12M3 5h1m-1 7h1m-1 7h1"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>'};
  const icon=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.spark}</svg>`;
  function icons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
  let toastId;
  function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastId);toastId=setTimeout(()=>$('toast').hidden=true,3500);}
  function empty(iconName,title,description){return `<div class="empty-state"><span class="icon-tile">${icon(iconName)}</span><strong>${esc(title)}</strong><p>${esc(description)}</p></div>`;}
  function navigate(id,scroll=true){
    const button=document.querySelector(`[data-tab="${id}"]`);if(!button)return;
    document.querySelectorAll('[data-tab]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
    document.querySelectorAll('.tab').forEach(section=>section.classList.toggle('hidden',section.id!==id));
    $('currentSection').textContent=button.querySelector('span:nth-child(2)').textContent;
    history.replaceState(null,'','#'+id);
    if(id==='progress')renderProgress();if(id==='nutrition')renderProtein();
    if(id==='boxing')paintBoxing();
    if(scroll)window.scrollTo({top:0,behavior:'instant'});
  }
  function date(){ $('headerDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}); }
  function openCheckin(){const el=$('weeklyCheckin');el.open=true;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});el.querySelector('summary').focus({preventScroll:true});}
  function updatePlan(){if(['energy','knee','back','hip'].some(id=>!$(id).reportValidity()))return;recalcMode();toast('Your plan has been refreshed.');}
  function restore(input){const file=input.files[0];if(file&&confirm('Restore this backup? Matching records on this device will be replaced.'))importBackup(file);else input.value='';}
  function foodPreview(){const food=FOODS[+$('food').value];if(!food)return;const qty=+$('qty').value;$('portionUnit').textContent=food.unit.includes('ml')?'ml':'g';$('foodPreview').textContent=Number.isFinite(qty)&&qty>0?(food.protein*qty/100).toFixed(1)+' g':'—';}
  function paintNutrition(){
    const total=Number(daily().protein)||0,target=Number(profile().proteinTarget)||60;
    $('proteinRing').style.setProperty('--protein-sweep',Math.max(0,Math.min(360,total/target*360))+'deg');
    $('proteinFraction').textContent=`of ${target} g target`;
    $('proteinEncouragement').textContent=total>=target?'Target reached.':total>0?'You’re building it.':'A fresh start.';
    $('proteinRemaining').textContent=total>=target?'Today’s target is covered.':`${Math.max(0,target-total).toFixed(1)} g to your personal target.`;
    foodPreview();
    const logs=get('protein-'+todayKey(),[]);
    $('foodLog').innerHTML=logs.length?logs.map((x,i)=>`<div class="food-row"><span class="food-row-icon">${icon('leaf')}</span><div><strong>${esc(x.name)}</strong><small>${esc(x.qty)} ${FOODS.find(f=>f.name===x.name)?.unit.includes('ml')?'ml':'g'}</small></div><b>${esc(x.protein)} g</b><button data-remove-food="${i}" aria-label="Remove ${esc(x.name)}">×</button></div>`).join(''):empty('leaf','Your plate starts here','Add your first portion above. Your food log will appear here.');
    document.querySelectorAll('[data-remove-food]').forEach(b=>b.onclick=()=>{if(!confirm('Remove this food entry?'))return;const records=get('protein-'+todayKey(),[]);records.splice(+b.dataset.removeFood,1);set('protein-'+todayKey(),records);const d=daily();d.protein=records.reduce((n,x)=>n+(Number(x.protein)||0),0);saveDaily(d);renderProtein();toast('Food entry removed.');});
  }
  function paintBoxing(){
    if(!$('timerOrbit'))return;
    const duration=isRest?restVal:timerInitial;
    $('timerOrbit').style.setProperty('--sweep',Math.max(0,Math.min(360,(1-timerVal/duration)*360))+'deg');
    $('boxingStatus').textContent=timerVal<=0?'Session complete':timerId?'Session in progress':timerVal===timerInitial&&!isRest&&roundNo===1?'Ready when you are':'Paused';
    $('boxingCue').textContent=isRest?'Let your breathing settle. Your next round is coming.':timerVal<=0?'Take a breath. Confirm your activity to save it.':'Relax your shoulders. Keep your breathing easy.';
    $('boxingStart').disabled=!!timerId||timerVal<=0;
    $('boxingPause').disabled=!timerId;
    document.querySelectorAll('[data-box-preset]').forEach(b=>{const selected=+b.dataset.boxPreset===timerInitial;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
  }
  function paintProgress(){
    const card=$('habitProgress')?.firstElementChild;if(!card)return;
    // Keep evidence-backed comparison text generated by the session module.
    if(!card.querySelector('.progress-metrics')){
      const text=card.querySelector('h2')?.textContent||'';
      const logs=get('habitSessions',[]),dates=getWeekDates();
      const minutes=Math.round(logs.filter(s=>dates.includes(s.date)).reduce((n,s)=>n+s.activeSeconds,0)/60);
      const metrics=document.createElement('div');metrics.className='progress-metrics';
      metrics.innerHTML=`<div><strong>${minutes}<small> min</small></strong><span>Movement / 7 days</span></div><div><strong>${logs.length}</strong><span>Sessions saved</span></div>`;
      card.querySelector('h2').after(metrics);
      card.querySelector('h2').textContent=text.replace(/^1 active days/, '1 active day');
      const desc=metrics.nextElementSibling;if(desc?.tagName==='P')desc.remove();
      const journal=$('habitProgress').lastElementChild;
      if(!logs.length)journal.innerHTML='<h2>Session journal</h2>'+empty('calendar','Your story is just beginning','Complete a guided session and find your activity here.');
    }
    const checkins=get('progressLogs',[]);
    $('progressHistory').innerHTML=checkins.length?checkins.slice(-8).reverse().map(x=>`<div class="hist"><strong>${esc(x.date||'Date not recorded')}</strong><div class="quiet">Weight ${esc(x.weight||'—')} kg · Waist ${esc(x.waist||'—')} cm · Boxing ${esc(x.boxing||'—')}s · Effort ${esc(x.rpe||'—')}/10</div></div>`).join(''):empty('chart','A baseline for your next chapter','Save a weekly check-in to start seeing changes over time.');
  }
  window.addEventListener('load',()=>{
    icons();date();paintNutrition();paintBoxing();paintProgress();
    document.querySelectorAll('[data-tab]').forEach(b=>{b.setAttribute('aria-label',b.querySelector('span:nth-child(2)').textContent);b.onclick=()=>navigate(b.dataset.tab);b.addEventListener('keydown',event=>{const buttons=[...document.querySelectorAll('[data-tab]')],i=buttons.indexOf(b);let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(i+1)%buttons.length;else if(['ArrowLeft','ArrowUp'].includes(event.key))next=(i+buttons.length-1)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();buttons[next].focus();navigate(buttons[next].dataset.tab);});});
    document.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('today');};
    document.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{$('food').value=b.dataset.food;$('qty').value=b.dataset.qty;foodPreview();$('food').focus();document.querySelector('.food-entry').scrollIntoView({block:'center',behavior:'instant'});toast('Portion filled. Tap Add to record it.');});
    $('food').addEventListener('change',foodPreview);$('qty').addEventListener('input',foodPreview);
    navigate(['today','boxing','progress','nutrition','settings'].includes(location.hash.slice(1))?location.hash.slice(1):'today',false);
  });
  document.addEventListener('habitupdated',()=>{paintProgress();date();});
  window.addEventListener('focus',date);
  return {toast,openCheckin,updatePlan,restore,paintBoxing,paintNutrition,paintProgress};
})();

const interfaceRenderProtein=renderProtein;
renderProtein=function(){interfaceRenderProtein();UI.paintNutrition();};
const interfaceDrawTimer=drawTimer;
drawTimer=function(){interfaceDrawTimer();UI.paintBoxing();};
const interfaceStartTimer=startTimer,interfacePauseTimer=pauseTimer;
startTimer=function(){interfaceStartTimer();UI.paintBoxing();};
pauseTimer=function(){interfacePauseTimer();UI.paintBoxing();};

// A labeled chart rather than an unexplained line; missing measurements are omitted.
drawChart=function(){
  const c=document.getElementById('chart'),ctx=c.getContext('2d'),logs=get('progressLogs',[]).filter(x=>Number.isFinite(x.boxing)&&x.boxing>0).slice(-10);
  const w=c.width,h=c.height,pad=40,max=Math.max(60,...logs.map(x=>x.boxing));
  ctx.clearRect(0,0,w,h);ctx.font='16px Segoe UI';ctx.fillStyle='#6e7969';
  if(logs.length<2){ctx.textAlign='center';ctx.fillText('Your next check-ins will draw the picture.',w/2,h/2-5);ctx.font='14px Segoe UI';ctx.fillText('Add two boxing durations to see your trend.',w/2,h/2+20);document.getElementById('chartSummary').textContent='No trend yet — a single measurement is just a starting point.';return;}
  ctx.textAlign='right';
  for(let i=0;i<=3;i++){const y=h-pad-i*(h-pad*2)/3;ctx.strokeStyle='#e7ebdf';ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-20,y);ctx.stroke();ctx.fillText(Math.round(max*i/3)+'s',pad-7,y+4);}
  const points=logs.map((x,i)=>({x:pad+i*(w-pad-25)/(logs.length-1),y:h-pad-x.boxing/max*(h-pad*2)}));
  const gradient=ctx.createLinearGradient(0,pad,0,h-pad);gradient.addColorStop(0,'#a1b48a55');gradient.addColorStop(1,'#a1b48a05');
  ctx.beginPath();ctx.moveTo(points[0].x,h-pad);points.forEach(p=>ctx.lineTo(p.x,p.y));ctx.lineTo(points.at(-1).x,h-pad);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='#748e5b';ctx.lineWidth=3;ctx.stroke();
  points.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#748e5b';ctx.fill();});
  ctx.font='14px Segoe UI';ctx.fillStyle='#6e7969';ctx.textAlign='left';ctx.fillText(String(logs[0].date||'Earlier'),pad,h-13);ctx.textAlign='right';ctx.fillText(String(logs.at(-1).date||'Latest'),w-25,h-13);
  document.getElementById('chartSummary').textContent=logs.map(x=>`${x.date}: ${x.boxing}s`).join(' · ');
};
