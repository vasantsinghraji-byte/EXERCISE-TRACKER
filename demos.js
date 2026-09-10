/* Two-position schematic demos derived from the exercise library's written cues.
   These illustrate direction and setup; they do not assess a person's technique. */
const Demos=(()=>{
  // Each pose is head, neck, hip, two elbows/hands and two knees/feet.
  const standing=[[80,22],[80,40],[80,86],[61,60],[56,80],[99,60],[104,80],[65,110],[60,139],[95,110],[100,139]];
  const pose=(changes={})=>standing.map((p,i)=>changes[i]||p);
  const seated=pose({0:[75,35],1:[75,53],2:[75,95],3:[65,70],4:[63,94],5:[91,74],6:[94,94],7:[106,97],8:[108,139],9:[114,97],10:[118,139]});
  const tabletop=[[35,65],[49,72],[107,72],[47,100],[47,136],[56,102],[56,136],[107,119],[132,136],[115,119],[140,136]];
  const prone=[[30,124],[45,125],[92,125],[49,130],[70,136],[50,135],[68,139],[113,99],[135,136],[117,108],[144,136]];
  const defs={
    march:[pose({7:[58,89],8:[58,111]}),pose({9:[102,89],10:[102,111]}),'Lift one foot gently.','Lower, then lift the other foot.'],
    armcircles:[pose({3:[52,43],4:[29,47],5:[108,43],6:[131,47]}),pose({3:[52,53],4:[29,42],5:[108,53],6:[131,42]}),'Arms out; start with small circles.','Circle smoothly; reverse direction halfway.'],
    torso:[pose({3:[62,52],4:[84,57],5:[98,52],6:[76,57]}),pose({3:[64,54],4:[45,49],5:[95,51],6:[76,47]}),'Keep your pelvis facing forward.','Turn your chest gently; alternate sides.'],
    hipcircles:[pose({3:[59,61],4:[73,84],5:[101,61],6:[87,84]}),pose({2:[89,86],3:[61,61],4:[81,84],5:[103,61],6:[97,84]}),'Hands on hips; knees relaxed.','Move your pelvis in a small circle; reverse.'],
    catcow:[tabletop.map((p,i)=>i===0?[34,55]:i===1?[49,65]:i===2?[107,70]:p),tabletop.map((p,i)=>i===0?[35,78]:i===1?[49,68]:i===2?[107,67]:p),'Inhale; gently extend your spine.','Exhale; round your spine without forcing.'],
    child:[tabletop,[[37,109],[52,114],[103,108],[36,126],[20,137],[43,131],[25,140],[103,135],[134,137],[112,138],[143,139]],'Start on all fours with knees apart.','Ease hips toward heels; reach forward.'],
    ham:[seated.map((p,i)=>i===9?[108,118]:i===10?[144,139]:p),seated.map((p,i)=>i===0?[96,49]:i===1?[91,67]:i===9?[108,118]:i===10?[144,139]:p),'Extend one leg, heel down; knee soft.','Hinge forward from the hips. Switch sides.'],
    hipflex:[pose({0:[78,27],1:[78,45],2:[80,88],7:[52,105],8:[49,138],9:[105,134],10:[138,138]}),pose({0:[73,27],1:[73,45],2:[74,88],7:[48,105],8:[49,138],9:[105,134],10:[138,138]}),'Half-kneel; tuck the pelvis slightly.','Squeeze rear glute; ease forward a little.'],
    calf1:[pose({0:[68,25],1:[71,43],2:[89,89],3:[48,53],4:[24,53],5:[49,61],6:[24,63],7:[72,113],8:[65,139],9:[112,114],10:[135,139]}),pose({0:[57,25],1:[60,43],2:[80,89],3:[43,54],4:[24,53],5:[44,62],6:[24,63],7:[62,112],8:[65,139],9:[107,112],10:[135,139]}),'Hands on wall; rear knee straight.','Lean forward gently with rear heel down.'],
    calf2:[pose({0:[66,25],1:[69,43],2:[88,89],3:[47,53],4:[24,53],5:[48,61],6:[24,63],7:[70,113],8:[65,139],9:[103,110],10:[130,139]}),pose({0:[63,32],1:[66,50],2:[85,96],3:[46,53],4:[24,53],5:[47,61],6:[24,63],7:[62,118],8:[65,139],9:[97,119],10:[130,139]}),'Hands on wall; both heels down.','Soften the rear knee; keep heel planted.'],
    ankle:[pose({7:[57,111],8:[51,139],9:[100,114],10:[123,139]}),pose({7:[44,111],8:[51,139],9:[100,114],10:[123,139]}),'Face a wall with your foot flat.','Guide the knee toward the wall; heel stays down.'],
    openbook:[[[30,111],[45,120],[93,120],[68,111],[96,110],[68,115],[96,114],[112,102],[134,120],[113,107],[136,125]],[[30,111],[45,120],[93,120],[68,111],[96,110],[38,94],[20,72],[112,102],[134,120],[113,107],[136,125]],'Lie on your side with knees stacked.','Sweep top arm open; keep knees together.'],
    bridge:[prone,prone.map((p,i)=>i===2?[91,97]:i===7?[113,96]:i===9?[117,100]:p)],
    birddog:[tabletop,tabletop.map((p,i)=>i===5?[28,71]:i===6?[10,71]:i===9?[130,71]:i===10?[151,71]:p)],
    pushup:[[[28,53],[42,61],[93,89],[42,99],[42,136],[50,102],[50,137],[118,109],[146,136],[122,111],[150,138]],[[28,92],[42,100],[93,114],[25,119],[42,136],[32,122],[50,137],[118,125],[146,136],[122,128],[150,138]]],
    chairsquat:[standing,pose({0:[63,51],1:[68,69],2:[92,106],3:[51,80],4:[31,79],5:[52,87],6:[33,87],7:[62,111],8:[60,139],9:[71,116],10:[78,139]})],
    calfraises:[standing,standing.map((p,i)=>[p[0],p[1]-(i===8||i===10?0:8)])],
    balance:[standing,pose({9:[104,103],10:[110,123]})]
  };
  Object.assign(defs.bridge,{2:'Lie down, knees bent and feet planted.',3:'Squeeze glutes; lift hips, then lower slowly.'});
  Object.assign(defs.birddog,{2:'Start on all fours with a gentle brace.',3:'Reach opposite arm and leg; keep pelvis level.'});
  Object.assign(defs.pushup,{2:'Hold a straight line from shoulders to feet.',3:'Lower under control, then press back up.'});
  Object.assign(defs.chairsquat,{2:'Stand in front of a stable chair.',3:'Hips back; touch the chair, then stand.'});
  Object.assign(defs.calfraises,{2:'Stand tall, holding support as needed.',3:'Rise onto the balls of your feet; lower slowly.'});
  Object.assign(defs.balance,{2:'Stand beside a wall or stable support.',3:'Lift one foot a little; switch sides after holding.'});
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function figure(points,id,frame){
    const pairs=[[1,2],[1,3],[3,4],[1,5],[5,6],[2,7],[7,8],[2,9],[9,10]];
    let lines=pairs.map(([a,b])=>`<path d="M${points[a].join(' ')} L${points[b].join(' ')}"/>`).join('');
    if(id==='catcow')lines=lines.replace(/<path d="M[^\"]+"\/>/,`<path d="M49 ${frame?68:65} Q78 ${frame?40:90} 107 ${frame?67:70}"/>`);
    const support=['calf1','calf2','ankle'].includes(id)?'<path class="demo-support" d="M20 30V142"/>':['ham','chairsquat'].includes(id)?'<path class="demo-support" d="M82 111h48m-43 0v31m39-31v31"/>':['balance','calfraises'].includes(id)?'<path class="demo-support" d="M119 70h25v72"/>':'';
    return `<svg viewBox="0 0 160 155" role="img" aria-label="${escape(defs[id][frame+2])}"><path class="demo-floor" d="M12 143H150"/>${support}<g class="demo-body">${lines}<circle cx="${points[0][0]}" cy="${points[0][1]}" r="10"/></g></svg>`;
  }
  function card(id){const d=defs[id];if(!d)return '';return `<details class="exercise-demo" data-demo="${id}"><summary>See a short movement demo <span aria-hidden="true">＋</span></summary><div class="demo-scenes" data-frame="0">${[0,1].map(n=>`<figure data-scene="${n}" ${n?'hidden':''}>${figure(d[n],id,n)}<figcaption>${n+1}. ${escape(d[n+2])}</figcaption></figure>`).join('')}</div><div class="demo-controls"><button type="button" data-demo-play>Play 8-second demo</button><button type="button" data-demo-next>Next position</button></div><p class="quiet">Simplified movement illustration. Read the cues, move comfortably, and use support where needed. It does not check your form.</p></details>`;}
  let playing=null,timer=null;
  function stop(){clearInterval(timer);timer=null;if(playing?.isConnected)playing.querySelector('[data-demo-play]').textContent='Play 8-second demo';playing=null;}
  function next(el){const scenes=el.querySelector('.demo-scenes'),n=1-Number(scenes.dataset.frame);scenes.dataset.frame=n;el.querySelectorAll('[data-scene]').forEach(f=>f.hidden=+f.dataset.scene!==n);}
  document.addEventListener('click',event=>{const el=event.target.closest('.exercise-demo');if(!el)return;if(event.target.closest('[data-demo-next]')){stop();next(el);}else if(event.target.closest('[data-demo-play]')){if(playing===el){stop();return;}stop();playing=el;event.target.textContent='Pause demo';let ticks=0;timer=setInterval(()=>{if(!el.isConnected||!el.open||document.hidden||++ticks>=4){stop();return;}next(el);},2000);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  document.addEventListener('toggle',event=>{if(event.target===playing&&!playing.open)stop();},true);
  return {card,ids:()=>Object.keys(defs)};
})();
