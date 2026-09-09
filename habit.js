/* Local-first daily sessions. Legacy daily records remain readable. */
const Habit = (() => {
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaults = {minutes:2,goal:3,focus:'Mobility',level:'Beginning',floor:false,support:true,audio:false};
  const prefs = () => ({...defaults,...get('habitPreferences',{})});
  const sessions = () => get('habitSessions',[]);
  let run = null, interval = null, deadline = 0, seenDate = todayKey();
  const dialog = document.createElement('dialog');
  dialog.id = 'guide'; dialog.setAttribute('aria-labelledby','guideTitle');
  document.body.append(dialog);
  const notice = document.createElement('p'); notice.id='habitNotice'; notice.hidden=true; notice.setAttribute('role','alert');
  document.querySelector('.wrap').prepend(notice);
  function persist(key,value) {
    try { set(key,value); return true; }
    catch { notice.hidden=false; notice.textContent='Your browser could not save this change. Free some device storage or export a backup, then try again.'; return false; }
  }
  const floorIds = ['catcow','child','hipflex','openbook','bridge','birddog','pushup'];
  const supportIds = ['ham','calf1','calf2','ankle','chairsquat','calfraises','balance'];
  function candidates(p=prefs(),d=daily(),history=sessions()) {
    const latest=history.at(-1);
    const recent=latest && Date.now()-new Date(latest.endedAt).getTime()<48*3600000;
    const light=d.energy<=3 || d.knee>=3 || d.back>=5 || d.hip>=5 || (recent && (latest.effort==='Hard'||latest.discomfort==='yes'));
    const yesterday=new Date(); yesterday.setDate(yesterday.getDate()-1);
    const strengthRecently=history.some(s=>s.date>=localDateKey(yesterday)&&s.steps.some(step=>EXERCISES.find(e=>e.id===step.id)?.category==='Strength'));
    return EXERCISES.filter(e=>{
      if(!p.floor && floorIds.includes(e.id)) return false;
      if(!p.support && supportIds.includes(e.id)) return false;
      if((d.knee>=3 || d.back>=5 || d.hip>=5) && !['armcircles','march'].includes(e.id)) return false;
      if(d.knee>=3 && e.id==='march') return false;
      if((light || strengthRecently) && e.category==='Strength') return false;
      if(p.level==='Beginning' && e.id==='pushup') return false;
      return true;
    }).sort((a,b)=>Number(b.category===p.focus)-Number(a.category===p.focus));
  }
  function activeDates(history=sessions()) {
    const dates=new Set(history.filter(s=>s.steps.length).map(s=>s.date));
    for(let i=0;i<localStorage.length;i++) {
      const key=localStorage.key(i);
      if(/^day-\d{4}-\d{2}-\d{2}$/.test(key) && Object.values(get(key,{}).done||{}).some(Boolean)) dates.add(key.slice(4));
    }
    return dates;
  }
  function weekDates() {
    const monday=new Date(); monday.setHours(12,0,0,0); monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
    return Array.from({length:7},(_,i)=>{const day=new Date(monday); day.setDate(day.getDate()+i); return localDateKey(day);});
  }
  function refresh() {
    const p=prefs(), history=sessions(), days=activeDates(history), week=weekDates();
    const count=week.filter(d=>days.has(d)).length, rest=get('habitRest',[]), resting=rest.includes(todayKey());
    const available=candidates(), last=history.at(-1);
    const reason=[`${p.minutes} minutes including setup and breaks`,p.floor?'floor movements allowed':'no floor work',p.support?'chair or wall available':'no equipment',`${chooseMode().toLowerCase()} readiness`];
    if(last && Date.now()-new Date(last.endedAt).getTime()<48*3600000 && (last.effort==='Hard'||last.discomfort==='yes')) reason.push('lighter after your last feedback');
    $('habitHome').innerHTML=`
      <div class="card hero"><span class="eyebrow">A little movement. A better day.</span>
      <h2>${resting?'Room to recover.':days.has(todayKey())?'You showed up today.':'Your next small win.'}</h2>
      <p>${resting?'Rest is part of your plan. There is nothing to catch up on.':days.has(todayKey())?'Your activity is recorded. You can finish here for today.':'Choose the time you have. We’ll guide the next step.'}</p>
      <div class="choices" aria-label="Session length">${[2,5,10].map(n=>`<button data-minutes="${n}" aria-pressed="${p.minutes===n}">${n} min</button>`).join('')}</div>
      <p>${escape(reason.join(' · '))}. Update your readiness below if anything changed.</p>
      <button class="primary" id="quickStart">${get('habitDraft',null)?'Resume unfinished session':resting?'Choose gentle movement instead':`Start my ${p.minutes}-minute session`}</button>
      <details class="habit-settings"><summary>Make it fit you</summary><div class="grid2">
      <label>Focus<select id="habitFocus">${['Mobility','Strength','Warm-up'].map(x=>`<option ${p.focus===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Experience<select id="habitLevel">${['Beginning','Regular'].map(x=>`<option ${p.level===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Floor movements<select id="habitFloor"><option value="no">No floor work</option><option value="yes" ${p.floor?'selected':''}>Floor is okay</option></select></label>
      <label>Support available<select id="habitSupport"><option value="yes">Chair or wall</option><option value="no" ${!p.support?'selected':''}>None</option></select></label>
      <label>Activity days per week<select id="habitGoal">${[1,2,3,4,5,6,7].map(n=>`<option ${p.goal===n?'selected':''}>${n}</option>`).join('')}</select></label>
      <label>Spoken cues<select id="habitAudio"><option value="no">Off</option><option value="yes" ${p.audio?'selected':''}>On (if supported)</option></select></label>
      </div><button id="saveHabitPrefs">Save preferences</button></details></div>
      <div class="card"><div class="row"><strong>This week · ${count} / ${p.goal} activity days</strong><span class="pill">${count>=p.goal?'Goal reached':'Every visit is a fresh start'}</span></div>
      <div class="week">${week.map((d,i)=>`<div class="day ${days.has(d)?'moved':rest.includes(d)?'rest':''} ${d===todayKey()?'current':''}" aria-label="${d}: ${days.has(d)?'active':rest.includes(d)?'planned rest':'no activity recorded'}">${['M','T','W','T','F','S','S'][i]}<b>${days.has(d)?'✓':rest.includes(d)?'☾':'·'}</b></div>`).join('')}</div>
      <p class="quiet">Monday–Sunday · ✓ activity · ☾ planned rest. Missed days never erase your history.</p>
      <button id="restToday">${resting?'Remove today’s rest marker':'Plan rest today'}</button>
      <p class="quiet">${available.length?'Suggested first movement: '+escape(available[0].name)+'. Swap or skip any movement that does not feel right.':'No matching movements. Adjust your preferences or take a rest day.'}</p></div>`;
    document.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{persist('habitPreferences',{...prefs(),minutes:+b.dataset.minutes});refresh();});
    $('saveHabitPrefs').onclick=()=>{persist('habitPreferences',{...prefs(),focus:$('habitFocus').value,level:$('habitLevel').value,floor:$('habitFloor').value==='yes',support:$('habitSupport').value==='yes',goal:+$('habitGoal').value,audio:$('habitAudio').value==='yes'});refresh();};
    $('quickStart').onclick=start;
    $('restToday').onclick=()=>{persist('habitRest',resting?rest.filter(d=>d!==todayKey()):[...rest,todayKey()]);refresh();};
    renderHistory();
    renderPlan();
    const rolling=getWeekDates();
    $('sessions7').textContent=rolling.filter(d=>days.has(d)).length;
    for(const category of ['Mobility','Strength']) {
      const categoryDates=new Set(history.filter(s=>s.steps.some(step=>EXERCISES.find(e=>e.id===step.id)?.category===category)).map(s=>s.date));
      rolling.forEach(date=>{const d=get('day-'+date,{});if(EXERCISES.some(e=>e.category===category&&d.done?.[e.id]))categoryDates.add(date);});
      $(category.toLowerCase()+'7').textContent=rolling.filter(d=>categoryDates.has(d)).length;
    }
  }
  function renderHistory() {
    const history=sessions(), days=activeDates(history), rolling=getWeekDates();
    const total=history.filter(s=>rolling.includes(s.date)).reduce((n,s)=>n+s.activeSeconds,0);
    const completed=history.length, milestone=[1,5,10,25,50,100].filter(n=>completed>=n).at(-1);
    const logs=get('progressLogs',[]).filter(x=>Number.isFinite(x.balance)&&x.balance>0);
    const first=logs[0], latest=logs.at(-1);
    const balance=logs.length>=2?`Reported balance: ${first.balance}s → ${latest.balance}s (${first.date} to ${latest.date}). Compare only when using the same support and testing conditions.`:'Add two balance check-ins under the same conditions to see a comparison.';
    const boxing=get('progressLogs',[]).filter(x=>Number.isFinite(x.boxing)&&x.boxing>0&&Number.isFinite(x.rpe)&&x.rpe>=1&&x.rpe<=10);
    const newest=boxing.at(-1), previous=newest?boxing.slice(0,-1).reverse().find(x=>x.boxing===newest.boxing&&x.date!==newest.date):null;
    const boxingStory=previous?`At the same reported ${newest.boxing}s round length, effort changed from ${previous.rpe}/10 to ${newest.rpe}/10. Compare only with similar pace, technique and rest.`:'Record boxing duration and effort on different days to compare similar rounds.';
    $('habitProgress').innerHTML=`<div class="card"><span class="eyebrow">Your effort adds up</span><h2>${rolling.filter(d=>days.has(d)).length} active days in the last 7</h2><p>${Math.round(total/60)} guided movement minutes recorded · ${completed} saved sessions overall</p><p class="quiet">${escape(balance)}</p><p class="quiet">${milestone?`${milestone}-session milestone reached. Your history stays with you.`:'Your first completed session starts your story.'}</p><p class="quiet">Times are self-reported or timer-assisted, not sensor verified. Older checkmarks count toward active days, but have no recorded duration.</p></div>
      <div class="card"><strong>Session journal</strong>${history.slice(-12).reverse().map(s=>`<div class="session-row"><div><b>${escape(s.title)}</b><div class="quiet">${escape(s.date)} · ${Math.round(s.activeSeconds)}s movement · ${s.steps.length} completed steps${s.effort?' · '+escape(s.effort):''}${s.discomfort==='yes'?' · discomfort reported':''}</div></div><button data-remove-session="${escape(s.id)}">Remove record</button></div>`).join('')||'<p class="quiet">Finish a guided session to see it here. A short session counts.</p>'}</div>`;
    const story=document.createElement('p');story.className='quiet';story.textContent=boxingStory;$('habitProgress').firstElementChild.append(story);
    document.querySelectorAll('[data-remove-session]').forEach(b=>b.onclick=()=>{if(confirm('Remove this session record? This cannot be undone.')){persist('habitSessions',sessions().filter(s=>s.id!==b.dataset.removeSession));refresh();}});
  }
  function checkpoint() { if(run) persist('habitDraft',{...run,running:false}); }
  function start() {
    pauseTimer();
    const draft=get('habitDraft',null);
    if(draft) {run=draft;run.running=false;}
    else {
      const pool=candidates(); if(!pool.length) return alert('No movements match these preferences. Adjust them or rest today.');
      const p=prefs();
      run={id:crypto.randomUUID(),title:`${p.minutes}-minute ${p.focus.toLowerCase()}`,date:todayKey(),startedAt:new Date().toISOString(),index:0,phase:'setup',remaining:15,running:false,steps:[],elapsed:0,items:Array.from({length:p.minutes},(_,i)=>pool[i%pool.length].id)};
      checkpoint();
    }
    if(!dialog.open) dialog.showModal();
    renderGuide();
  }
  function speak(text) { if(prefs().audio && 'speechSynthesis' in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text));} }
  function stopClock() {clearInterval(interval);interval=null; if(run)run.running=false; if('speechSynthesis' in window)speechSynthesis.cancel();}
  function tick() {
    if(!run?.running)return;
    const remaining=Math.max(0,(deadline-Date.now())/1000);
    if(run.phase==='move')run.elapsed+=Math.max(0,run.remaining-remaining);
    run.remaining=remaining;
    if(remaining<=0){
      stopClock();
      if(run.phase==='setup'){run.phase='move';run.remaining=45;renderGuide();resume();return;}
      run.phase='confirm';speak('Interval finished. Confirm the movement you completed.');renderGuide();checkpoint();
    } else drawClock();
  }
  function drawClock() { if($('guideClock'))$('guideClock').textContent=String(Math.ceil(run.remaining)).padStart(2,'0')+'s'; }
  function resume() {
    if(!run||run.running||!['setup','move'].includes(run.phase))return;
    run.running=true;deadline=Date.now()+run.remaining*1000;
    interval=setInterval(tick,200);
    speak(run.phase==='setup'?'Get comfortable. Movement begins in fifteen seconds.':EXERCISES.find(e=>e.id===run.items[run.index]).name+'. Move slowly. Stop if uncomfortable.');
    renderGuide();
  }
  function pause() {if(run?.running)tick();stopClock();checkpoint();}
  function renderGuide() {
    if(run.phase==='feedback'){renderFeedback();return;}
    const e=EXERCISES.find(e=>e.id===run.items[run.index]);
    dialog.innerHTML=`<span class="eyebrow">Step ${run.index+1} of ${run.items.length} · ${escape(run.phase==='setup'?'Setup / rest':run.phase==='confirm'?'Interval finished':'Move at your pace')}</span>
      <progress class="guide-track" value="${run.index}" max="${run.items.length}" aria-label="Session progress"></progress>
      <h2 id="guideTitle" tabindex="-1">${escape(e.name)}</h2><p>${escape(e.motion)}</p>
      <p class="quiet">45-second movement window. Use comfortable repetitions; for two-sided movements, split the time between sides. Finishing the full dose is not required.</p>
      <div id="guideClock" class="guide-clock" aria-label="Seconds remaining"></div>
      <p class="quiet">Stop or skip if uncomfortable. Timer completion alone does not record exercise.</p>
      <div class="guide-actions"><button id="guideToggle" ${run.phase==='confirm'?'disabled':''}>${run.running?'Pause':run.phase==='setup'?'Begin setup':'Continue'}</button><button id="guideSwap">Swap</button><button id="guideSkip">Skip</button>
      <button class="primary" id="guideDone" ${run.phase==='setup'?'disabled':''}>I did this movement</button><button id="guideFinish">Finish early</button><button id="guideClose">Save & close</button></div>`;
    drawClock();
    $('guideToggle').onclick=()=>{if(run.running){pause();renderGuide();}else resume();};
    $('guideSwap').onclick=()=>{pause();const pool=candidates();const current=pool.findIndex(x=>x.id===e.id);const next=pool[(current+1)%pool.length];if(!next||next.id===e.id)return alert('No other matching movement. You can skip this step.');run.items[run.index]=next.id;run.phase='setup';run.remaining=15;run.elapsed=0;checkpoint();renderGuide();};
    $('guideSkip').onclick=()=>advance(false);
    $('guideDone').onclick=()=>advance(true);
    $('guideFinish').onclick=()=>{pause();run.phase='feedback';checkpoint();renderFeedback();};
    $('guideClose').onclick=()=>{pause();dialog.close();refresh();};
  }
  function advance(completed) {
    pause();
    if(completed && run.elapsed>0)run.steps.push({id:run.items[run.index],seconds:Math.min(45,Math.round(run.elapsed))});
    run.index++;run.elapsed=0;
    if(run.index>=run.items.length)run.phase='feedback';else{run.phase='setup';run.remaining=15;}
    checkpoint();renderGuide();
  }
  function renderFeedback() {
    const seconds=run.steps.reduce((n,s)=>n+s.seconds,0);
    dialog.innerHTML=`<span class="eyebrow">A moment to check in</span><h2 id="guideTitle">${run.steps.length?'You made time to move.':'Thanks for checking in.'}</h2><p>${run.steps.length} movements reported · ${Math.round(seconds)} seconds of activity.</p>
      <p class="quiet">${run.steps.length?'Only movements you confirmed are included. Save them, then finish for today.':'No activity will be recorded. You can try again another time.'}</p>
      <label>How did it feel?<select id="guideEffort"><option value="">Prefer not to say</option><option>Easy</option><option>About right</option><option>Hard</option></select></label>
      <label>Any discomfort?<select id="guideDiscomfort"><option value="">Prefer not to say</option><option value="no">No</option><option value="yes">Yes</option></select></label>
      <div class="guide-actions"><button class="primary" id="guideSave">${run.steps.length?'Save & finish for today':'Finish for today'}</button><button id="guideDiscard">Discard session</button></div>`;
    $('guideSave').onclick=()=>{
      if(run.steps.length){
        const record={id:run.id,title:run.title,date:run.date,startedAt:run.startedAt,endedAt:new Date().toISOString(),steps:run.steps,activeSeconds:seconds,effort:$('guideEffort').value||null,discomfort:$('guideDiscomfort').value||null};
        if(!persist('habitSessions',[...sessions().filter(s=>s.id!==run.id),record]))return;
      }
      localStorage.removeItem('habitDraft');run=null;dialog.close();refresh();
    };
    $('guideDiscard').onclick=()=>{if(confirm('Discard this unfinished session?')){localStorage.removeItem('habitDraft');run=null;dialog.close();refresh();}};
  }
  dialog.addEventListener('cancel',()=>{pause();setTimeout(refresh,0);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();if(run&&dialog.open)renderGuide();}else rollover();});
  window.addEventListener('pagehide',pause);
  function rollover() {
    if(seenDate!==todayKey()){seenDate=todayKey();updateToday();renderProtein();$('todayDate').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'});refresh();}
  }
  window.addEventListener('focus',rollover);
  setInterval(rollover,30000);
  function boxingComplete(seconds) {
    if(run||get('habitDraft',null)) {alert('Finish or discard your guided session before recording a boxing session.');return;}
    run={id:crypto.randomUUID(),title:'Boxing intervals',date:todayKey(),startedAt:new Date(Date.now()-seconds*1000).toISOString(),phase:'feedback',steps:[{id:'boxing',seconds}],running:false};
    checkpoint();dialog.showModal();renderFeedback();
  }
  window.addEventListener('load',()=>{
    refresh();
    document.querySelector('footer').textContent='Body Tracker 3 · Small steps, steady progress';
    document.querySelector('#settings .small:last-child').textContent='App version 3.0.0';
    document.querySelector('[data-tab="progress"]').addEventListener('click',renderHistory);
  });
  return {refresh,candidates,activeDates,weekDates,boxingComplete,isActive:()=>!!run,escape};
})();

// Refresh companion data after legacy check-ins and manual exercise logging.
const originalUpdateToday=updateToday;
updateToday=function(){originalUpdateToday();Habit.refresh();};
const originalAdherence=updateAdherence;
updateAdherence=function(){originalAdherence();Habit.refresh();};
const originalRenderProgress=renderProgress;
renderProgress=function(){originalRenderProgress();Habit.refresh();};
const originalPlanFor=planFor;
planFor=function(mode){const allowed=new Set(Habit.candidates().map(e=>e.id));return originalPlanFor(mode).filter(e=>allowed.has(e.id));};

// Deadline-based boxing timer; explicit confirmation records activity once.
let boxingDeadline=0, boxingLogged=false;
const legacySetBoxing=setBoxing, legacyResetBoxing=resetTimer;
setBoxing=function(...args){legacySetBoxing(...args);boxingLogged=false;};
resetTimer=function(){legacyResetBoxing();boxingLogged=false;};
startTimer=function(){
  if(timerId||timerVal<=0)return;
  if(Habit.isActive()||get('habitDraft',null))return alert('Finish or discard your guided session before starting boxing.');
  boxingDeadline=Date.now()+timerVal*1000;
  timerId=setInterval(()=>{
    timerVal=Math.max(0,(boxingDeadline-Date.now())/1000);
    if(timerVal<=0){
      if(!isRest&&roundNo<totalRounds){isRest=true;timerVal=restVal;}
      else if(isRest){isRest=false;roundNo++;timerVal=timerInitial;}
      else {pauseTimer();timerVal=0;if(!boxingLogged){boxingLogged=true;Habit.boxingComplete(timerInitial*totalRounds);}}
      boxingDeadline=Date.now()+timerVal*1000;
    }
    drawTimer();
  },200);
};
drawTimer=function(){const seconds=Math.ceil(timerVal);document.getElementById('timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');document.getElementById('phase').textContent=timerVal<=0?'FINISHED':isRest?'REST':'WORK';document.getElementById('roundLabel').textContent=`Round ${roundNo} / ${totalRounds}`;};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseTimer();});
