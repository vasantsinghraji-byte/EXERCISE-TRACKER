/* Favorites and personal routines; user-authored text is escaped at rendering boundaries. */
const Companion=(()=>{
  const $=id=>document.getElementById(id),esc=Habit.escape;
  const valid=id=>EXERCISES.some(e=>e.id===id), favorites=()=>get('favoriteExercises',[]).filter(valid), routines=()=>get('personalRoutines',[]);
  const name=id=>EXERCISES.find(e=>e.id===id)?.name||'Unknown movement';
  const modal=document.createElement('dialog');modal.id='personalEditor';modal.setAttribute('aria-labelledby','personalTitle');document.body.append(modal);
  let editing=null;
  function save(key,value){try{set(key,value);return true;}catch{UI.toast('Could not save. Export a backup and check device storage.');return false;}}
  function toggle(id){
    if(!valid(id))return;
    const current=favorites(),selected=!current.includes(id);
    if(!save('favoriteExercises',selected?[...current,id]:current.filter(x=>x!==id)))return;
    document.querySelectorAll('[data-favorite]').forEach(b=>{const yes=favorites().includes(b.dataset.favorite);b.setAttribute('aria-pressed',String(yes));b.textContent=yes?'♥ Saved favorite':'♡ Save favorite';});
    render();UI.toast(selected?'Saved to your favorites.':'Removed from favorites.');
  }
  function render(){
    const fav=favorites(),all=routines();
    $('personalSpace').innerHTML=`<div class="content-grid personal-grid"><div class="card"><div class="section-label"><h2>Your favorite movements</h2><button id="browseFavorites">Choose favorites</button></div><p class="quiet">Familiar movements, one tap away. Your readiness still comes first.</p><div class="favorite-list">${fav.length?fav.map(id=>`<div class="favorite-row"><button data-preview="${id}">${esc(name(id))}</button><button data-start-favorite="${id}" aria-label="Start ${esc(name(id))}">Start · 1 min</button><button data-favorite="${id}" aria-pressed="true" aria-label="Remove ${esc(name(id))} from favorites">♥</button></div>`).join(''):'<p class="quiet">Save a heart on any exercise card, or choose movements here.</p>'}</div></div><div class="card"><div class="section-label"><h2>Your personal routines</h2><button id="newRoutine">+ Create routine</button></div><p class="quiet">Morning, desk break, or evening: make a sequence that fits.</p><div class="routine-list">${all.map(r=>`<div class="routine-row"><div><strong>${esc(r.name)}</strong><small>${r.items.length} movements · about ${r.items.length} min</small></div><div class="routine-actions"><button data-start-routine="${esc(r.id)}">Start</button><button data-edit-routine="${esc(r.id)}">Edit</button><button data-delete-routine="${esc(r.id)}" aria-label="Delete ${esc(r.name)}">×</button></div></div>`).join('')||'<p class="quiet">No routines saved yet. Start with a template or build your own.</p>'}</div></div></div>`;
    $('browseFavorites').onclick=library;$('newRoutine').onclick=()=>editor();
  }
  function show(){if(!modal.open)modal.showModal();}
  function library(){
    editing=null;
    modal.innerHTML=`<h2 id="personalTitle">Find your favorites</h2><p class="quiet">Preview a movement, then save the ones you enjoy. Some may be excluded from today’s plan.</p><div class="favorite-catalog">${EXERCISES.map(e=>`<div class="favorite-row"><button data-preview="${e.id}">${esc(e.name)}</button><button data-favorite="${e.id}" aria-pressed="${favorites().includes(e.id)}">${favorites().includes(e.id)?'♥ Saved favorite':'♡ Save favorite'}</button></div>`).join('')}</div><button class="button-dark full" data-personal-close>Done</button>`;show();
  }
  function preview(id){if(!valid(id))return;modal.innerHTML=`<h2 id="personalTitle">${esc(name(id))}</h2>${Demos.card(id)}<p>${esc(EXERCISES.find(e=>e.id===id).motion)}</p><button data-favorite="${id}" aria-pressed="${favorites().includes(id)}">${favorites().includes(id)?'♥ Saved favorite':'♡ Save favorite'}</button><div class="guide-actions"><button data-personal-library>All movements</button><button data-personal-close>Close</button></div>`;show();modal.querySelector('details').open=true;}
  function editor(id){const existing=routines().find(r=>r.id===id);editing=existing?{...existing,items:[...existing.items]}:{id:crypto.randomUUID(),name:'',items:[]};paintEditor();show();}
  function paintEditor(){
    modal.innerHTML=`<h2 id="personalTitle">${routines().some(r=>r.id===editing.id)?'Edit':'Create'} your routine</h2><label>Name<input id="routineName" maxlength="60" required value="${esc(editing.name)}" placeholder="e.g. Morning reset"></label><p class="quiet">Each movement gets 15s setup and 45s practice. Pauses can make it longer. Up to 20 movements.</p><div class="routine-templates"><button data-template="morning">Morning</button><button data-template="desk">Desk break</button><button data-template="evening">Evening</button></div><ol class="routine-order">${editing.items.map((id,i)=>`<li><span>${esc(name(id))}</span><button data-routine-up="${i}" ${i===0?'disabled':''} aria-label="Move ${esc(name(id))} up">↑</button><button data-routine-down="${i}" ${i===editing.items.length-1?'disabled':''} aria-label="Move ${esc(name(id))} down">↓</button><button data-routine-remove="${i}" aria-label="Remove ${esc(name(id))}">×</button></li>`).join('')}</ol><div class="inline-form"><label>Add movement<select id="routineExercise">${EXERCISES.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select></label><button id="routineAdd" ${editing.items.length>=20?'disabled':''}>+ Add</button></div><p id="routineError" role="alert" class="quiet"></p><div class="guide-actions"><button class="button-dark" id="routineSave">Save routine</button><button data-personal-close>Cancel</button></div>`;
    $('routineName').oninput=e=>editing.name=e.target.value;
    $('routineAdd').onclick=()=>{if(editing.items.length<20){editing.items.push($('routineExercise').value);paintEditor();}};
    $('routineSave').onclick=()=>{editing.name=$('routineName').value.trim();if(!editing.name||!$('routineName').reportValidity()){ $('routineError').textContent='Give your routine a name.';return;}if(!editing.items.length){$('routineError').textContent='Add at least one movement.';return;}if(save('personalRoutines',[...routines().filter(r=>r.id!==editing.id),editing])){modal.close();render();UI.toast('Routine saved.');}};
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;const d=button.dataset;
    if(d.favorite)toggle(d.favorite);
    if(d.preview)preview(d.preview);
    if(d.startFavorite){Habit.startRoutine(name(d.startFavorite),[d.startFavorite]);}
    if(d.startRoutine){const r=routines().find(r=>r.id===d.startRoutine);if(r)Habit.startRoutine(r.name,r.items);}
    if(d.editRoutine)editor(d.editRoutine);
    if(d.deleteRoutine&&confirm('Delete this saved routine? Completed sessions will remain.')){save('personalRoutines',routines().filter(r=>r.id!==d.deleteRoutine));render();}
    if('personalClose' in d)modal.close();
    if('personalLibrary' in d)library();
    if(d.template&&editing){const templates={morning:['march','armcircles','torso'],desk:['armcircles','torso','ham'],evening:['march','ham','calf1']};editing.items=[...templates[d.template]];editing.name=({morning:'Morning reset',desk:'Desk break',evening:'Evening unwind'})[d.template];paintEditor();}
    for(const [key,offset] of [['routineUp',-1],['routineDown',1]])if(key in d&&editing){const i=+d[key],j=i+offset;if(j>=0&&j<editing.items.length){[editing.items[i],editing.items[j]]=[editing.items[j],editing.items[i]];paintEditor();}}
    if('routineRemove' in d&&editing){editing.items.splice(+d.routineRemove,1);paintEditor();}
  });
  document.addEventListener('habitupdated',()=>{if($('personalSpace'))render();});
  window.addEventListener('load',render);
  return {render};
})();
