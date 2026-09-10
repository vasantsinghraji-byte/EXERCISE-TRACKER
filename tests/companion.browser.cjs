// New-feature integration checks, using isolated storage and a controlled clock.
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname;
  const file=path.resolve(root,name==='/'?'index.html':name.slice(1));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch();
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'America/Los_Angeles'}),page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install({time:new Date('2026-09-10T17:00:00Z')});
    const base=`http://127.0.0.1:${server.address().port}/`;
    await page.goto(base);await page.waitForSelector('#newRoutine');
    assert.equal(await page.evaluate(()=>Demos.ids().length),18);
    assert.ok(await page.evaluate(()=>EXERCISES.every(e=>Demos.card(e.id).includes('data-scene="1"'))),'Every exercise has a two-position demo');
    await page.click('#browseFavorites');await page.click('#personalEditor [data-favorite="torso"]');
    assert.deepEqual(await page.evaluate(()=>get('favoriteExercises',[])),['torso']);
    await page.click('#personalEditor [data-preview="torso"]');await page.click('[data-demo-play]');await page.clock.runFor(2000);
    await page.screenshot({path:path.join(root,'tests','demo-mobile.png')});
    assert.equal(await page.locator('.demo-scenes').getAttribute('data-frame'),'1');
    await page.clock.runFor(6000);assert.equal(await page.locator('[data-demo-play]').innerText(),'Play 8-second demo');
    await page.click('[data-demo-next]');assert.equal(await page.locator('.demo-scenes').getAttribute('data-frame'),'0');
    await page.click('[data-personal-close]');
    await page.click('#newRoutine');await page.click('[data-template="morning"]');
    await page.fill('#routineName','Morning <fresh>');await page.click('[data-routine-down="0"]');await page.click('#routineSave');
    assert.deepEqual(await page.evaluate(()=>get('personalRoutines',[])[0].items),['armcircles','march','torso']);
    await page.reload();await page.waitForSelector('[data-start-routine]');
    assert.match(await page.locator('.routine-list').innerText(),/Morning <fresh>/,'Routine name renders as text');
    await page.click('[data-start-routine]');assert.equal(await page.locator('#guideTitle').innerText(),'Arm circles');
    await page.click('#guideFinish');await page.click('#guideSave');
    await page.click('[data-start-favorite="torso"]');assert.equal(await page.locator('#guideTitle').innerText(),'Gentle torso rotations');
    await page.click('#guideFinish');await page.click('#guideSave');
    await page.evaluate(()=>{const d=daily();d.knee=5;saveDaily(d);});
    page.once('dialog',d=>{assert.match(d.message(),/do not match/);d.accept();});
    await page.click('[data-start-favorite="torso"]');assert.equal(await page.locator('#guide').isVisible(),false,'Favorites respect readiness');
    await page.click('[data-open-intent="Instagram"]');await page.fill('#intentReason','Reply to a friend');await page.fill('#intentAllowance','1');await page.check('#intentRemind');await page.click('#intentStart');
    await page.clock.runFor(61000);assert.equal(await page.locator('#intentReminder').isVisible(),true);
    await page.click('#intentPause');const paused=await page.locator('#intentElapsed').innerText();await page.clock.runFor(10000);assert.equal(await page.locator('#intentElapsed').innerText(),paused);
    await page.click('#intentFinish');await page.fill('#intentMinutes','2.5');await page.click('#intentSave');
    let logs=await page.evaluate(()=>get('intentLogs',[]));assert.equal(logs[0].minutes,2.5);assert.equal(logs[0].source,'self-reported');
    await page.click('[data-open-intent="YouTube"]');await page.click('#intentBreakNow');await page.selectOption('#intentBreakType','walk');await page.click('#intentSave');
    assert.equal(await page.evaluate(()=>get('habitSessions',[]).length),0,'Choosing a break does not fabricate exercise');
    await page.click('[data-tab="progress"]');assert.match(await page.locator('#weeklyReflection').innerText(),/2.5/);
    await page.fill('#reflectionNote','Putting the phone down helped.');await page.click('#reflectionSave');
    await page.reload();assert.equal(await page.locator('#reflectionNote').inputValue(),'Putting the phone down helped.');
    await page.goto(base+'?intent=instagram');await page.waitForSelector('#intentApp');assert.equal(await page.locator('#intentApp').inputValue(),'Instagram');
    await page.fill('#intentReason','Check one message');await page.uncheck('#intentRemind');await page.click('#intentStart');await page.click('[data-intent-close]');
    await page.clock.runFor(5000);await page.reload();await page.click('[data-open-intent]');assert.match(await page.locator('#intentElapsed').innerText(),/0:0[5-9]/,'Timer resumes from persisted timestamps');
    page.once('dialog',d=>d.accept());await page.click('#intentDiscard');assert.equal(await page.evaluate(()=>get('intentLogs',[]).length),2,'Discard adds no reported minutes');
    for(const width of [390,820,1440]){await page.setViewportSize({width,height:900});for(const tab of ['today','progress','settings']){await page.click(`[data-tab="${tab}"]`);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${tab} fits at ${width}`);}}
    await page.click('[data-tab="today"]');await page.screenshot({path:path.join(root,'tests','companion-desktop.png'),fullPage:true});
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();await context.setOffline(true);await page.reload();
    await page.click('#browseFavorites');await page.click('#personalEditor [data-preview="bridge"]');assert.equal(await page.locator('.demo-scenes').count(),1,'Exercise demos work offline');await page.click('[data-personal-close]');
    await page.goto(base+'?intent=youtube');await page.waitForSelector('#intentApp');assert.equal(await page.locator('#intentApp').inputValue(),'YouTube','Intent deep links work offline');
    await context.setOffline(false);
    assert.deepEqual(errors,[]);console.log('PASS: favorites, demos, routine order/persistence/filtering, intent timer, thresholds, confirmed reporting, breaks, notes, deep links and responsive layouts.');
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
