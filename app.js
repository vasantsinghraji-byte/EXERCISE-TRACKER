
const EXERCISES = [{"id": "march", "name": "Easy marching", "dose": "2 min", "focus": "Warm-up / circulation", "motion": "Stand tall and march slowly in place. Lift one foot, then the other. Breathe normally. Keep the pace easy enough that you can still talk.", "muscles": "Hip flexors, calves, general circulation", "category": "Warm-up"}, {"id": "armcircles", "name": "Arm circles", "dose": "30 sec each way", "focus": "Shoulders / upper back", "motion": "Stand tall. Start with small circles and gradually make them medium-sized. Go forward, then backward. Keep ribs relaxed.", "muscles": "Deltoids, rotator cuff, upper back", "category": "Warm-up"}, {"id": "torso", "name": "Gentle torso rotations", "dose": "8 each side", "focus": "Thoracic rotation", "motion": "Stand with feet hip-width and knees soft. Rotate your chest gently left and right while keeping the pelvis mostly forward. Do not force the lower back.", "muscles": "Thoracic spine, obliques", "category": "Mobility"}, {"id": "hipcircles", "name": "Hip circles", "dose": "8 each way", "focus": "Hip mobility", "motion": "Hands on hips. Move your pelvis slowly in a circle: forward \u2192 side \u2192 back \u2192 side. Reverse direction.", "muscles": "Hip capsule, glutes, trunk stabilizers", "category": "Mobility"}, {"id": "catcow", "name": "Cat-Cow", "dose": "8 slow reps", "focus": "Spine mobility", "motion": "Start on all fours. Exhale and gently round the spine. Inhale and slowly extend the spine. Move smoothly without forcing the neck or lower back.", "muscles": "Spinal extensors/flexors, thoracic and lumbar mobility", "category": "Mobility"}, {"id": "child", "name": "Modified Child's Pose", "dose": "20\u201330 sec \u00d7 2", "focus": "Back / lats / hips", "motion": "From all fours, keep knees slightly apart and push hips back toward heels while reaching hands forward. Stop before knee or back pain.", "muscles": "Lats, thoracolumbar fascia, glutes, hips", "category": "Mobility"}, {"id": "ham", "name": "Seated hamstring stretch", "dose": "20\u201330 sec \u00d7 2/side", "focus": "Hamstrings", "motion": "Sit near the edge of a chair. Extend one leg forward with heel down and knee slightly soft. Keep the back long and hinge forward from the hips until the back of the thigh stretches.", "muscles": "Hamstrings", "category": "Mobility"}, {"id": "hipflex", "name": "Half-kneeling hip-flexor stretch", "dose": "20\u201330 sec \u00d7 2/side", "focus": "Hip flexors", "motion": "One knee down, other foot forward. Slightly tuck pelvis, squeeze the glute of the kneeling side, then move the pelvis forward a few centimeters while keeping the torso upright.", "muscles": "Iliopsoas, rectus femoris", "category": "Mobility"}, {"id": "calf1", "name": "Straight-knee calf stretch", "dose": "30 sec \u00d7 2/side", "focus": "Calf mobility", "motion": "Hands on wall, one leg behind. Keep the back heel down and knee straight, then lean forward until the upper calf stretches.", "muscles": "Gastrocnemius", "category": "Mobility"}, {"id": "calf2", "name": "Bent-knee calf stretch", "dose": "20 sec \u00d7 2/side", "focus": "Ankle mobility", "motion": "Same wall position, but gently bend the back knee while keeping the heel down.", "muscles": "Soleus, ankle dorsiflexion", "category": "Mobility"}, {"id": "ankle", "name": "Knee-to-wall ankle mobility", "dose": "8 reps/side", "focus": "Ankle dorsiflexion", "motion": "Face a wall with one foot flat. Drive the knee toward the wall over the 2nd/3rd toe while keeping the heel fully down, then return slowly.", "muscles": "Soleus, ankle joint mobility", "category": "Mobility"}, {"id": "openbook", "name": "Open-book rotation", "dose": "6 reps/side", "focus": "Thoracic spine / chest", "motion": "Lie on your side with hips and knees bent about 90\u00b0. Keep knees stacked. Sweep the top arm backward while rotating the chest, then return slowly.", "muscles": "Thoracic spine, pectorals, obliques", "category": "Mobility"}, {"id": "bridge", "name": "Glute bridge", "dose": "10\u201312 \u00d7 2", "focus": "Posterior chain", "motion": "Lie on your back with knees bent. Brace lightly, squeeze the glutes, and lift hips until shoulders-hips-knees form a line. Pause, then lower slowly.", "muscles": "Glute max, hamstrings, core", "category": "Strength"}, {"id": "birddog", "name": "Bird-dog", "dose": "6/side \u00d7 2", "focus": "Core stability", "motion": "Start on all fours. Brace the abdomen and extend opposite arm and leg without rotating the pelvis. Pause, return, then switch sides.", "muscles": "Deep core, multifidus, glutes, shoulder stabilizers", "category": "Strength"}, {"id": "pushup", "name": "Push-ups", "dose": "8\u201310 \u00d7 2", "focus": "Upper-body strength", "motion": "Keep body in one line. Lower under control with elbows about 30\u201345\u00b0 from the body, then press back up. Stop before failure.", "muscles": "Chest, triceps, anterior deltoid, core", "category": "Strength"}, {"id": "chairsquat", "name": "Chair squat", "dose": "8 \u00d7 2", "focus": "Leg strength / mechanics", "motion": "Stand in front of a chair. Push hips back and bend knees together. Keep knees tracking over toes, lightly touch the chair, then stand by pushing the floor away.", "muscles": "Quads, glutes, adductors, core", "category": "Strength"}, {"id": "calfraises", "name": "Calf raises", "dose": "12 \u00d7 2", "focus": "Ankle strength", "motion": "Hold a wall or chair. Rise onto the balls of the feet, pause at the top, then lower slowly.", "muscles": "Gastrocnemius, soleus", "category": "Strength"}, {"id": "balance", "name": "Single-leg balance", "dose": "20 sec \u00d7 2/side", "focus": "Balance / stability", "motion": "Stand near support. Lift one foot a few centimeters, keep pelvis level and standing knee soft. Use fingertip support only if needed.", "muscles": "Glute medius, ankle stabilizers, core", "category": "Strength"}];
const FOODS = [{"name": "Soy chunks (dry)", "protein": 52, "unit": "100 g"}, {"name": "Roasted chana", "protein": 20, "unit": "100 g"}, {"name": "Peanuts", "protein": 25, "unit": "100 g"}, {"name": "Sattu", "protein": 20, "unit": "100 g"}, {"name": "Dal cooked", "protein": 9, "unit": "100 g"}, {"name": "Rajma cooked", "protein": 8.5, "unit": "100 g"}, {"name": "Milk", "protein": 3.2, "unit": "100 ml"}, {"name": "Curd", "protein": 3.5, "unit": "100 g"}, {"name": "Paneer", "protein": 18, "unit": "100 g"}, {"name": "Besan", "protein": 22, "unit": "100 g"}];
const VERSION = '3.2.0';

const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const todayKey = () => localDateKey();
const get = (k,d) => {
  const raw = localStorage.getItem(k);
  try { return raw === null ? d : JSON.parse(raw); } catch { return d; }
};
const set = (k,v) => localStorage.setItem(k, JSON.stringify(v));

function profile(){ return get('profile',{weight:90,height:180,age:29,waist:'',proteinTarget:60}); }
function saveProfile(p){ set('profile',p); }
function dailyKey(){ return 'day-'+todayKey(); }
function daily(){ return get(dailyKey(),{energy:3,knee:0,back:3,hip:3,mode:null,done:{},rpe:null,protein:0}); }
function saveDaily(d){ set(dailyKey(),d); }

function chooseMode(){
  const d=daily();
  if(d.energy<=2 || d.knee>=5 || d.back>=7 || d.hip>=7) return 'Recovery';
  if(d.energy===3 || d.knee>=3 || d.back>=5 || d.hip>=5) return 'Light';
  return 'Full';
}
function planFor(mode){
  const recovery=['march','catcow','child','ham','hipflex','calf2','ankle','openbook'];
  const light=['march','armcircles','torso','hipcircles','catcow','ham','hipflex','ankle','openbook','bridge','birddog','balance'];
  if(mode==='Recovery') return EXERCISES.filter(e=>recovery.includes(e.id));
  if(mode==='Light') return EXERCISES.filter(e=>light.includes(e.id));
  return EXERCISES;
}
function updateToday(){
  const d=daily();
  d.mode=d.mode||chooseMode(); saveDaily(d);
  document.getElementById('mode').textContent=d.mode+' session';
  ['energy','knee','back','hip'].forEach(id=>document.getElementById(id).value=d[id]);
  renderPlan();
}
function renderPlan(){
  const d=daily(), plan=planFor(d.mode||chooseMode());
  document.getElementById('exerciseList').innerHTML=plan.map(e=>`
    <div class="exercise">
      <button class="check ${d.done[e.id]?'done':''}" onclick="toggleDone('${e.id}')">${d.done[e.id]?'✓':''}</button>
      <div class="grow">
        <div class="row"><strong>${e.name}</strong><span class="pill">${e.category}</span></div>
        <div class="meta">${e.dose} · ${e.focus}</div>
        <button class="link" onclick="toggleDetails('${e.id}')">Motion & muscles</button>
        <div class="details" id="det-${e.id}"><b>Motion:</b> ${e.motion}<br><br><b>Works on:</b> ${e.muscles}</div>
      </div>
    </div>`).join('');
  const done=plan.filter(e=>d.done[e.id]).length;
  const pct=plan.length?Math.round(done/plan.length*100):0;
  document.getElementById('pct').textContent=pct+'%';
  document.getElementById('bar').style.width=pct+'%';
}
function toggleDone(id){ const d=daily(); d.done[id]=!d.done[id]; saveDaily(d); renderPlan(); updateAdherence(); }
function toggleDetails(id){ document.getElementById('det-'+id).classList.toggle('open'); }
function recalcMode(){
  const d=daily();
  const fields=['energy','knee','back','hip'];
  if(fields.some(id=>!document.getElementById(id).value || !document.getElementById(id).checkValidity())) return alert('Enter energy from 1–5 and discomfort scores from 0–10.');
  fields.forEach(id=>d[id]=+document.getElementById(id).value);
  d.mode=null; saveDaily(d); updateToday();
}
function saveRPE(){
  if(!document.getElementById('rpe').value || !document.getElementById('rpe').reportValidity()) return;
  const d=daily(); d.rpe=+document.getElementById('rpe').value; saveDaily(d);
  document.getElementById('rpeMsg').textContent='Session effort saved.';
}
function getWeekDates(){
  const a=[], now=new Date();
  for(let i=6;i>=0;i--){ const x=new Date(now); x.setDate(now.getDate()-i); a.push(localDateKey(x)); }
  return a;
}
function updateAdherence(){
  let sessions=0,mobility=0,strength=0;
  getWeekDates().forEach(dt=>{
    const d=get('day-'+dt,null); if(!d) return;
    const ids=Object.keys(d.done||{}).filter(k=>d.done[k]);
    if(ids.length) sessions++;
    if(ids.some(id=>EXERCISES.find(e=>e.id===id)?.category==='Mobility')) mobility++;
    if(ids.some(id=>EXERCISES.find(e=>e.id===id)?.category==='Strength')) strength++;
  });
  document.getElementById('sessions7').textContent=sessions;
  document.getElementById('mobility7').textContent=mobility;
  document.getElementById('strength7').textContent=strength;
}

let timerInitial=20,timerVal=20,timerId=null,restVal=60,roundNo=1,totalRounds=2,isRest=false;
function drawTimer(){
  const m=Math.floor(timerVal/60), s=timerVal%60;
  document.getElementById('timer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  document.getElementById('phase').textContent=isRest?'REST':'WORK';
  document.getElementById('roundLabel').textContent=`Round ${roundNo} / ${totalRounds}`;
}
function setBoxing(work,rest,rounds){ pauseTimer(); timerInitial=work; timerVal=work; restVal=rest; totalRounds=rounds; roundNo=1; isRest=false; drawTimer(); }
function startTimer(){
  if(timerId) return;
  timerId=setInterval(()=>{
    timerVal--;
    if(timerVal<=0){
      if(navigator.vibrate) navigator.vibrate([180,100,180]);
      if(!isRest && roundNo<totalRounds){ isRest=true; timerVal=restVal; }
      else if(isRest){ isRest=false; roundNo++; timerVal=timerInitial; }
      else { pauseTimer(); timerVal=0; }
    }
    drawTimer();
  },1000);
}
function pauseTimer(){ if(timerId) clearInterval(timerId); timerId=null; }
function resetTimer(){ pauseTimer(); timerVal=timerInitial; roundNo=1; isRest=false; drawTimer(); }

function recommendation(){
  const logs=get('progressLogs',[]).filter(x=>Number.isFinite(x.rpe)&&x.rpe>=1&&x.rpe<=10&&Number.isFinite(x.recovery)&&x.recovery>0).slice(-3);
  if(logs.length<2) return 'Stay with 20–30 sec rounds for now.';
  const avgRpe=logs.reduce((a,b)=>a+(+b.rpe||0),0)/logs.length;
  const avgRec=logs.reduce((a,b)=>a+(+b.recovery||0),0)/logs.length;
  if(avgRpe<=6 && avgRec<=2) return 'You can cautiously add 5–10 sec to work rounds.';
  if(avgRpe>=8 || avgRec>3) return 'Keep the same round length or reduce it slightly.';
  return 'Maintain current duration until it feels repeatable.';
}
function saveProgress(){
  const inputs=['weight','waist','balance','progKnee','boxingLongest','recovery','progEnergy','progRpe'];
  if(inputs.some(id=>!document.getElementById(id).checkValidity() || (document.getElementById(id).value!=='' && +document.getElementById(id).value<0))) return alert('Check your progress values. Use non-negative measurements and the indicated score ranges.');
  const p=profile();
  p.weight=+document.getElementById('weight').value||p.weight;
  p.waist=+document.getElementById('waist').value||'';
  saveProfile(p);
  const rec={
    date:todayKey(),weight:+document.getElementById('weight').value||'',waist:+document.getElementById('waist').value||'',
    bend:document.getElementById('bend').value,balance:+document.getElementById('balance').value||0,
    knee:+document.getElementById('progKnee').value||0,boxing:+document.getElementById('boxingLongest').value||0,
    recovery:document.getElementById('recovery').value===''?null:+document.getElementById('recovery').value,energy:+document.getElementById('progEnergy').value||0,
    rpe:document.getElementById('progRpe').value===''?null:+document.getElementById('progRpe').value
  };
  const logs=get('progressLogs',[]); logs.push(rec); set('progressLogs',logs);
  document.getElementById('progressMsg').textContent='Progress saved.';
  renderProgress();
}
function renderProgress(){
  const p=profile();
  document.getElementById('weight').value=p.weight||'';
  document.getElementById('waist').value=p.waist||'';
  const logs=get('progressLogs',[]);
  document.getElementById('progressHistory').innerHTML=logs.slice(-8).reverse().map(x=>`<div class="hist"><b>${x.date}</b> · Wt ${x.weight||'-'} kg · Waist ${x.waist||'-'} cm · Boxing ${x.boxing||'-'}s · RPE ${x.rpe||'-'}</div>`).join('')||'<div class="small">No progress entries yet.</div>';
  document.getElementById('boxRec').textContent=recommendation();
  drawChart();
}
function drawChart(){
  const c=document.getElementById('chart'),ctx=c.getContext('2d'),logs=get('progressLogs',[]).slice(-10);
  ctx.clearRect(0,0,c.width,c.height); ctx.font='12px sans-serif'; ctx.fillStyle='#6b7280';
  if(logs.length<2){ ctx.fillText('Add at least 2 progress entries',20,40); return; }
  const vals=logs.map(x=>+x.boxing||0), max=Math.max(...vals,60);
  ctx.strokeStyle='#2563eb'; ctx.lineWidth=3; ctx.beginPath();
  vals.forEach((v,i)=>{
    const x=20+i*(c.width-40)/(vals.length-1), y=c.height-20-v*(c.height-40)/max;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke(); ctx.fillText('Boxing round seconds',10,14);
}

function addProtein(){
  if(!document.getElementById('qty').value || !document.getElementById('qty').reportValidity()) return;
  const food=FOODS[+document.getElementById('food').value], qty=+document.getElementById('qty').value||0;
  const protein=food.protein*qty/100;
  const d=daily(); d.protein=(d.protein||0)+protein; saveDaily(d);
  const hist=get('protein-'+todayKey(),[]); hist.push({name:food.name,qty,protein:+protein.toFixed(1)}); set('protein-'+todayKey(),hist);
  renderProtein();
}
function renderProtein(){
  const p=profile(),d=daily();
  document.getElementById('proteinTarget').value=p.proteinTarget||60;
  document.getElementById('proteinTotal').textContent=(d.protein||0).toFixed(1)+' g';
  document.getElementById('proteinBar').style.width=Math.min(100,Math.round((d.protein||0)/(p.proteinTarget||60)*100))+'%';
  document.getElementById('foodLog').innerHTML=get('protein-'+todayKey(),[]).map(x=>`<div class="hist">${x.name} · ${x.qty} g/ml → <b>${x.protein} g</b></div>`).join('')||'<div class="small">No foods logged yet.</div>';
}
function saveProteinTarget(){ if(!document.getElementById('proteinTarget').value || !document.getElementById('proteinTarget').reportValidity())return; const p=profile(); p.proteinTarget=+document.getElementById('proteinTarget').value; saveProfile(p); renderProtein(); }

function exportBackup(){
  const data={version:VERSION,exportedAt:new Date().toISOString(),storage:{}};
  for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); data.storage[k]=localStorage.getItem(k); }
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='body-tracker-backup-'+todayKey()+'.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
function importBackup(file){
  if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const data=JSON.parse(r.result);
      Object.entries(data.storage||{}).forEach(([k,v])=>localStorage.setItem(k,v));
      alert('Backup imported. Reloading app.'); location.reload();
    }catch(e){ alert('Invalid backup file.'); }
  };
  r.readAsText(file);
}
function clearToday(){ if(confirm("Clear only today's checkmarks and scores?")){ localStorage.removeItem(dailyKey()); localStorage.removeItem('protein-'+todayKey()); updateToday(); renderProtein(); } }

function initFoods(){
  document.getElementById('food').innerHTML=FOODS.map((f,i)=>`<option value="${i}">${f.name} (${f.protein} g/${f.unit})</option>`).join('');
}
document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.tab').forEach(s=>s.classList.add('hidden'));
  document.getElementById(btn.dataset.tab).classList.remove('hidden');
  if(btn.dataset.tab==='progress') renderProgress();
  if(btn.dataset.tab==='nutrition') renderProtein();
});
window.addEventListener('load',()=>{
  document.getElementById('todayDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'});
  initFoods(); updateToday(); updateAdherence(); renderProgress(); renderProtein(); drawTimer();
});
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
