/* Voluntary intent check-ins. This module never claims to observe other apps.
   The clock estimates elapsed wall time; only confirmed minutes enter reflection. */
const Focus=(()=>{
  const $=id=>document.getElementById(id),esc=Habit.escape;
  const APPS=['Instagram','YouTube','Safari','Other'];
  const initialApp=new URLSearchParams(location.search).get('intent');
  const modal=document.createElement('dialog');modal.id='intentDialog';modal.setAttribute('aria-labelledby','intentTitle');document.body.append(modal);
  let stage='closed', toastDue=false;
  const draft=()=>get('intentDraft',null), logs=()=>get('intentLogs',[]);
  function write(key,value){try{set(key,value);return true;}catch{UI.toast('Could not save. Please check your device storage.');return false;}}
  function elapsed(d,now=Date.now()){return Math.max(0,(d.elapsed||0)+(d.running?Math.max(0,(now-d.segmentStart)/1000):0));}
  function weekKey(){return Habit.weekDates()[0];}
  function open(app='Other'){
    pauseTimer();
    if(document.querySelector('#guide[open]'))return;
    if(draft()){stage='active';paintActive();}
    else{stage='prompt';const settings=get('intentSettings',{minutes:10,remind:false});
      modal.innerHTML=`<span class="eyebrow">A LITTLE ROOM TO CHOOSE</span><h2 id="intentTitle">What did I come here to do?</h2><p>Choose what you want from this visit. Continuing is your choice, too.</p><label>App<select id="intentApp">${APPS.map(x=>`<option ${x.toLowerCase()===String(app).toLowerCase()?'selected':''}>${x}</option>`).join('')}</select></label><label>My intention<input id="intentReason" maxlength="160" placeholder="e.g. Reply to a friend" required></label><label>My allowance for this visit <span>minutes</span><input id="intentAllowance" type="number" min="1" max="120" value="${Number(settings.minutes)||10}" required></label><label class="check-label"><input id="intentRemind" type="checkbox" ${settings.remind?'checked':''}> Show a gentle reminder when I reach this time</label><p class="quiet">This is a voluntary stopwatch, not app monitoring. Reminders appear while Body Tracker is visible or when you return. No background notification is guaranteed.</p><div class="guide-actions"><button class="button-dark" id="intentStart">Continue intentionally</button><button id="intentBreakNow">Choose a break instead</button><button data-intent-close>Not now</button></div>`;
      $('intentStart').onclick=()=>{if(!$('intentReason').reportValidity()||!$('intentAllowance').reportValidity())return;begin(true);};
      $('intentBreakNow').onclick=()=>begin(false);
    }
    if(!modal.open)modal.showModal();
  }
  function begin(running){
    const minutes=+$('intentAllowance').value||10;
    const d={id:crypto.randomUUID(),app:$('intentApp').value,intention:$('intentReason').value.trim(),allowance:Math.min(120,Math.max(1,minutes))*60,remind:$('intentRemind').checked,elapsed:0,segmentStart:Date.now(),startedAt:new Date().toISOString(),running,notified:false};
    if(!write('intentDraft',d))return;
    write('intentSettings',{minutes:d.allowance/60,remind:d.remind});
    if(running){stage='active';paintActive();}else finish('break');renderHome();
  }
  function paintActive(){const d=draft();if(!d)return;modal.innerHTML=`<span class="eyebrow">YOUR INTENTIONAL VISIT</span><h2 id="intentTitle">${esc(d.app)} · your choice</h2><p>${esc(d.intention||'Taking a moment to choose.')}</p><div class="intent-clock" id="intentElapsed"></div><p class="quiet">Elapsed stopwatch time, including time away from this app. It does not measure actual ${esc(d.app)} use.</p><div id="intentReminder" role="status" class="intent-reminder" hidden>Your chosen allowance has passed. Take a breath: continue, finish, or choose a break.</div><div class="guide-actions"><button id="intentPause">${d.running?'Pause timer':'Resume timer'}</button><button id="intentFinish">Finish visit</button><button id="intentTakeBreak">Choose a break</button><button data-intent-close>Close this screen</button><button id="intentDiscard">Discard timer</button></div><p class="quiet">Closing this screen leaves the voluntary timer ${d.running?'running':'paused'}. Return here to finish and confirm your time.</p>`;
    $('intentPause').onclick=()=>{const x=draft();x.elapsed=elapsed(x);x.running=!x.running;x.segmentStart=Date.now();if(write('intentDraft',x))paintActive();};
    $('intentFinish').onclick=()=>finish('done');$('intentTakeBreak').onclick=()=>finish('break');
    $('intentDiscard').onclick=()=>{if(confirm('Discard this unfinished timer? No minutes will be added to reflection.')){localStorage.removeItem('intentDraft');modal.close();stage='closed';renderHome();}};
    tick();
  }
  function finish(choice){const d=draft();if(!d)return;d.elapsed=elapsed(d);d.running=false;if(!write('intentDraft',d))return;stage='finish';
    modal.innerHTML=`<span class="eyebrow">NOTICE, WITHOUT JUDGMENT</span><h2 id="intentTitle">${choice==='break'?'Make room for a break.':'How much time did you spend?'}</h2><p>The stopwatch estimates ${(d.elapsed/60).toFixed(1)} minutes. Adjust this to the time you actually spent in ${esc(d.app)}.</p><label>Minutes I’m reporting<input id="intentMinutes" type="number" min="0" max="1440" step="0.1" value="${Math.min(1440,Math.round(d.elapsed/6)/10)}" required></label>${choice==='break'?'<label>My break choice<select id="intentBreakType"><option value="phone-down">Put the phone down</option><option value="breathe">Pause and breathe</option><option value="walk">Take a short walk</option><option value="movement">Do a little movement</option></select></label>':''}<p class="quiet">This records your choice, not proof that a break or workout happened. Missing a limit never creates a penalty.</p><div class="guide-actions"><button id="intentSave" class="button-dark">Save my reflection</button><button id="intentBack">Back to timer</button></div>`;
    $('intentBack').onclick=()=>{stage='active';paintActive();};
    $('intentSave').onclick=()=>{if(!$('intentMinutes').reportValidity())return;
      const record={id:d.id,date:todayKey(),endedAt:new Date().toISOString(),app:d.app,intention:d.intention,minutes:+$('intentMinutes').value,choice,breakType:choice==='break'?$('intentBreakType').value:null,source:'self-reported'};
      if(!write('intentLogs',[...logs().filter(x=>x.id!==d.id),record]))return;
      localStorage.removeItem('intentDraft');modal.close();stage='closed';renderHome();reflection();UI.toast('Reflection saved. A fresh choice is always available.');
    };
  }
  function tick(){const d=draft();if(!d)return;const seconds=elapsed(d);
    if(stage==='active'&&$('intentElapsed'))$('intentElapsed').textContent=`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
    const due=d.remind&&seconds>=d.allowance;
    if($('intentReminder'))$('intentReminder').hidden=!due;
    if($('intentHomeStatus'))$('intentHomeStatus').textContent=due?'Your allowance has passed. A break is available whenever you choose.':`${d.app} · ${d.running?'timer running':'timer paused'} · ${Math.floor(seconds/60)} min elapsed (estimate)`;
    if(due&&!d.notified&&!document.hidden){d.notified=true;if(write('intentDraft',d)){if(!document.querySelector('dialog[open]'))UI.toast('Your chosen allowance has passed. You can choose a break.');else toastDue=true;}}
    if(toastDue&&!document.hidden&&!document.querySelector('dialog[open]')){toastDue=false;UI.toast('A break is available. Open your intentional visit to check in.');}
  }
  function renderHome(){const d=draft();$('intentHome').innerHTML=`<div class="card intent-home"><div><span class="eyebrow">A MOMENT BEFORE THE SCROLL</span><h2>${d?'Your intentional visit':'Make a little room to choose.'}</h2><p class="quiet" id="intentHomeStatus">${d?'A voluntary timer is available to resume.':'Set an intention, pick an allowance, and choose a break when it helps.'}</p><p class="quiet">Self-reported visits · no tracking of other apps</p></div><div class="intent-launchers">${d?'<button data-open-intent="Other" class="button-dark">Open my timer</button>':APPS.map(app=>`<button data-open-intent="${app}">${app}</button>`).join('')}</div></div>`;tick();}
  function reflection(){const dates=getWeekDates(),entries=logs().filter(x=>dates.includes(x.date)),total=entries.reduce((n,x)=>n+x.minutes,0),breaks=entries.filter(x=>x.choice==='break').length;
    const values=dates.map(date=>entries.filter(x=>x.date===date).reduce((n,x)=>n+x.minutes,0)),max=Math.max(...values,1);
    $('weeklyReflection').innerHTML=`<div class="card reflection-card"><span class="eyebrow">ATTENTION, WITHOUT A SCORE</span><h2>Your last seven days</h2><div class="reflection-metrics"><div><strong>${Number(total.toFixed(1))}<small> min</small></strong><span>Time you reported</span></div><div><strong>${breaks}</strong><span>Breaks you chose</span></div><div><strong>${entries.length}</strong><span>Visits reflected on</span></div></div><div class="reflection-bars">${dates.map((date,i)=>`<div><small>${Number(values[i].toFixed(1))}m</small><span style="height:${Math.max(3,values[i]/max*65)}px" aria-hidden="true"></span><time datetime="${date}">${new Date(date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'})}</time></div>`).join('')}</div><p class="quiet">These are your confirmed estimates, not device Screen Time. Break choices are separate from completed exercise. No entries means no data, not zero app use.</p><label>What helped me make an intentional choice?<textarea id="reflectionNote" maxlength="1000" rows="3" placeholder="A pattern, a small win, or something to try…">${esc(get('weeklyIntentNotes',{})[weekKey()]||'')}</textarea></label><button id="reflectionSave">Save this week’s note</button><details class="reflection-history"><summary>Review or remove reported visits</summary>${entries.slice().reverse().map(x=>`<div class="reflection-entry"><div><strong>${esc(x.app)} · ${esc(x.minutes)} min</strong><p class="quiet">${esc(x.date)} · ${x.choice==='break'?'Break chosen: '+esc(x.breakType):'Visit finished'}${x.intention?' · '+esc(x.intention):''}</p></div><button data-remove-intent="${esc(x.id)}" aria-label="Remove ${esc(x.app)} visit">×</button></div>`).join('')||'<p class="quiet">No visits reported in the last seven days.</p>'}</details></div>`;
    $('reflectionSave').onclick=()=>{if(write('weeklyIntentNotes',{...get('weeklyIntentNotes',{}),[weekKey()]:$('reflectionNote').value.trim()}))UI.toast('Your weekly note is saved.');};
  }
  function shortcutHelp(){const base=location.origin+location.pathname;const card=document.createElement('details');card.className='card shortcut-help';card.innerHTML=`<summary>Open an intent prompt with iPhone Shortcuts <span>+</span></summary><p class="quiet">Start with a manual shortcut: add a URL action with a link below, then Open URLs. You can run this before your visit to an app.</p>${APPS.slice(0,3).map(app=>`<label>${app} intent link<input readonly value="${esc(base+'?intent='+app.toLowerCase())}" aria-label="${app} intent link"></label>`).join('')}<p class="quiet">For automatic prompts, Shortcuts → Automation → App → Is Opened can launch your shortcut. Add a cooldown guard before Open URLs: only prompt if enough time has passed since the last prompt, and save the timestamp before opening Body Tracker. Otherwise switching back to Instagram or YouTube can trigger the prompt again.</p><p class="quiet">Avoid a Safari-open automation that opens this site in Safari: it can retrigger itself. Test automation behavior on your phone. The web app cannot configure these automations or supply their cooldown state for you.</p><p class="quiet">These links open a check-in, not an app-usage log. Start a voluntary timer, switch back yourself, and return to confirm your minutes. <a href="./ATTENTION.md">Read setup notes</a>.</p><a href="https://support.apple.com/en-asia/guide/shortcuts/apde31e9638b/ios" target="_blank" rel="noopener">Apple’s app-trigger instructions ↗</a>`;$('settings').append(card);card.querySelectorAll('input').forEach(input=>input.onclick=()=>input.select());}
  document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.openIntent)open(b.dataset.openIntent);if('intentClose' in b.dataset){modal.close();stage='closed';renderHome();}if(b.dataset.removeIntent&&confirm('Remove this reported visit?')){write('intentLogs',logs().filter(x=>x.id!==b.dataset.removeIntent));reflection();}});
  modal.addEventListener('cancel',()=>{stage='closed';setTimeout(renderHome,0);});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  window.addEventListener('storage',event=>{if(['intentDraft','intentLogs'].includes(event.key)){renderHome();reflection();if(modal.open){modal.close();stage='closed';}}});
  document.addEventListener('habitupdated',()=>{if($('weeklyReflection')&&!$('reflectionNote')?.matches(':focus'))reflection();});
  window.addEventListener('load',()=>{renderHome();reflection();shortcutHelp();if(initialApp&&APPS.some(x=>x.toLowerCase()===initialApp.toLowerCase())){history.replaceState(null,'',location.pathname+'#today');open(initialApp);}});
  setInterval(()=>{if(!document.hidden)tick();},1000);
  return {open,elapsed,reflection};
})();
