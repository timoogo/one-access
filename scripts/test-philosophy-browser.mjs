import assert from 'node:assert/strict';
import fs from 'node:fs';
// Requires Playwright, either installed locally or supplied via PLAYWRIGHT_MODULE.
// Optional: CHROMIUM_EXECUTABLE, PHILOSOPHY_URL, PHILOSOPHY_ARTIFACTS.
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import os from 'node:os';
const artifacts=process.env.PHILOSOPHY_ARTIFACTS||path.join(os.tmpdir(),'philosophy-browser');
fs.mkdirSync(artifacts,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE,'index.mjs')).href : 'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE,headless:true});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__qa={prevented:[],scrollWrites:[],focusWrites:0};
  const prevent=Event.prototype.preventDefault;
  Event.prototype.preventDefault=function(){window.__qa.prevented.push({type:this.type,key:this.key});return prevent.call(this)};
  const scroll=window.scrollTo;
  window.scrollTo=function(...args){window.__qa.scrollWrites.push({t:performance.now(),args});return scroll.apply(this,args)};
  const focus=HTMLElement.prototype.focus;
  HTMLElement.prototype.focus=function(...args){window.__qa.focusWrites++;return focus.apply(this,args)};
 });
 await page.goto(process.env.PHILOSOPHY_URL||'http://localhost:3000/philosophie');
 await page.locator('[data-mode=animated]').waitFor();
 await page.waitForTimeout(350);
 const stage=page.locator('[data-philosophy-stage]');
 const labels=await stage.evaluate(e=>JSON.parse(e.dataset.labels));
 const nodes=await page.locator('[data-node]').evaluateAll(es=>es.map(e=>({id:e.dataset.node,hold:+e.dataset.hold,arrive:+e.dataset.arrive,morph:+e.dataset.morph,travel:+e.dataset.travel,scroll:+e.dataset.scroll})));
 const scrollTime=async(time)=>{
  await stage.evaluate((e,time)=>window.scrollTo({top:Math.ceil(+e.dataset.scrollStart+time/+e.dataset.duration*(+e.dataset.scrollEnd- +e.dataset.scrollStart)),behavior:'instant'}),time);
  await page.waitForTimeout(60);
 };
 const state=async()=>stage.evaluate(e=>({label:e.dataset.label,phase:e.dataset.phase,time:+e.dataset.time,y:window.scrollY}));
 const opacity=async(selector)=>page.locator(selector).evaluate(e=>+getComputedStyle(e).opacity);
 const geometry=async()=>page.evaluate(()=>{
  const path=document.querySelector('[data-route]'),cursor=document.querySelector('[data-cursor]');
  const distance=+path.dataset.distance;
  const at=path.getPointAtLength(distance);
  return {distance,error:Math.hypot(at.x- +cursor.dataset.x,at.y- +cursor.dataset.y)};
 });
 const collisions=async()=>page.evaluate(()=>{
  const texts=[...document.querySelectorAll('[data-annotation],[data-recap]')].filter(e=>+getComputedStyle(e).opacity>.02).flatMap(e=>[...e.querySelectorAll('p')].map(p=>({id:e.dataset.annotation||e.dataset.recap,rect:p.getBoundingClientRect()})));
  const hits=[];
  function intersects(a,b,r){let low=0,high=1;const dx=b.x-a.x,dy=b.y-a.y;for(const[p,q]of[[-dx,a.x-r.left],[dx,r.right-a.x],[-dy,a.y-r.top],[dy,r.bottom-a.y]]){if(p===0){if(q<0)return false;continue}const t=q/p;if(p<0)low=Math.max(low,t);else high=Math.min(high,t);if(low>high)return false}return true}
  for(const line of document.querySelectorAll('[data-connector]')){
   if(+getComputedStyle(line).opacity<.02)continue;
   const matrix=line.getScreenCTM(),length=line.getTotalLength();
   let prev=line.getPointAtLength(0).matrixTransform(matrix);
   for(let d=2;d<=length+2;d+=2){const next=line.getPointAtLength(Math.min(d,length)).matrixTransform(matrix);for(const text of texts)if(intersects(prev,next,text.rect))hits.push([line.dataset.connector,text.id]);prev=next}
  }
  return [...new Set(hits.map(x=>x.join(':')))];
 });
 assert.ok(await opacity('[data-question]')>.999);
 await page.screenshot({path:path.join(artifacts, 'philosophy-qa-intro.png')});
 const before=await page.evaluate(()=>window.__qa.scrollWrites.length);
 await page.mouse.wheel(0,12); await page.waitForTimeout(150);
 assert.ok((await state()).time>0,'First tiny wheel starts timeline');
 assert.equal(await page.evaluate(()=>window.__qa.scrollWrites.length),before,'Wheel never writes scroll');
 // All scenes: frozen mid-travel, staging, hold, exact route head, full camera hold.
 for(let i=1;i<nodes.length;i++){
  const node=nodes[i],mid=node.travel+(node.arrive-node.travel)*.55;
  await scrollTime(mid);
  assert.equal((await state()).phase,'TRAVEL',node.id);
  assert.equal(await opacity(`[data-annotation="${node.id}"]`),0,`${node.id}: no premature text`);
  assert.equal(await page.locator(`[data-node="${node.id}"]`).isDisabled(),true,`${node.id}: future is disabled`);
  const frozen=await state(); await page.waitForTimeout(40); assert.deepEqual(await state(),frozen,'Travel stays frozen without snap');
  assert.ok((await geometry()).error<.08,`${node.id}: cursor is route head ${JSON.stringify(await geometry())}`);
  assert.deepEqual(await collisions(),[],`${node.id}: departing text`);
  await scrollTime((node.arrive+node.morph)/2);
  assert.equal(await opacity(`[data-annotation="${node.id}"]`),0,`${node.id}: text waits for morph`);
  await scrollTime(node.hold+.02);
  assert.equal((await state()).label,node.id);
  assert.equal((await state()).phase,'HOLD');
  assert.equal(await opacity(`[data-annotation="${node.id}"]`),1);
  assert.deepEqual(await collisions(),[],`${node.id}: hold connectors`);
  const camera=await page.locator('[data-camera]').getAttribute('style');
  await scrollTime(node.hold+.2);
  assert.equal(await page.locator('[data-camera]').getAttribute('style'),camera,`${node.id}: stable hold camera`);
 }
 console.log('PASS 20 scenes: travel, staging, cursor, HOLD, connector geometry');
 // Exact keyboard labels in both directions.
 await scrollTime(nodes[8].hold+.02);
 await page.keyboard.press('ArrowDown'); await page.waitForTimeout(700);
 assert.equal((await state()).label,nodes[9].id);
 await page.keyboard.press('ArrowUp'); await page.waitForTimeout(700);
 assert.equal((await state()).label,nodes[8].id);
 for(const key of ['PageDown','Space']){await page.keyboard.press(key);await page.waitForTimeout(700)}
 assert.equal((await state()).label,nodes[10].id);
 for(const key of ['PageUp','Shift+Space']){await page.keyboard.press(key);await page.waitForTimeout(700)}
 assert.equal((await state()).label,nodes[8].id);
 // Autonomy -> click visible old node, continuous rewind, native scroll afterwards.
 await scrollTime(nodes[17].hold+.05);
 await page.screenshot({path:path.join(artifacts, 'philosophy-qa-autonomy.png')});
 const visible=await page.locator('[data-node]').evaluateAll(es=>es.filter(e=>getComputedStyle(e).visibility==='visible'&&e.getAttribute('aria-current')!=='step').map(e=>e.dataset.node));
 assert.ok(visible.length>0,'Past node visible at Autonomy');
 const target=visible[0];
 const focusBefore=await page.evaluate(()=>window.__qa.focusWrites);
 await page.locator(`[data-node="${target}"]`).click();
 const samples=[];for(let i=0;i<8;i++){await page.waitForTimeout(70);samples.push((await state()).y)}
 assert.ok(samples.some((v,i)=>i&&v<samples[i-1]),'Rewind scroll moves backwards');
 assert.equal((await state()).label,target);
 assert.equal(await page.evaluate(()=>window.__qa.focusWrites),focusBefore,'No programmatic focus');
 // Multi-HOLD rewind from overview to Distance, through a real button.
 await scrollTime(labels.find(l=>l.id==='overview').time+.1);
 await page.screenshot({path:path.join(artifacts, 'philosophy-qa-overview.png')});
 await page.locator('[data-node="pillar-distance"]').click();
 await page.waitForTimeout(700);
 assert.equal((await state()).label,'pillar-distance');
 assert.ok(Math.abs((await state()).y-nodes[8].scroll)<=1);
 // Button retains native Space activation; global handler must leave it alone.
 await page.locator('[data-node="pillar-distance"]').focus();
 const yBefore=(await state()).y;
 await page.keyboard.press('Space'); await page.waitForTimeout(100);
 assert.equal((await state()).y,yBefore);
 await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
 assert.ok(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineWidth==='3px'),'Visible keyboard focus');
 assert.equal(await page.evaluate(()=>window.__qa.prevented.filter(x=>x.type==='wheel'||x.type==='touchmove'||x.key==='Tab').length),0);

 // Both native button activation keys rewind through the shared click handler.
 for(const key of ['Enter','Space']) {
  await scrollTime(labels.find(l=>l.id==='overview').time+.1);
  await page.locator('[data-node="pillar-distance"]').focus();
  await page.keyboard.press(key); await page.waitForTimeout(700);
  assert.equal((await state()).label,'pillar-distance',key+' activates node');
 }
 // Native controls must keep their key behavior, including descendants.
 await page.evaluate(()=>{
  const fixture=document.createElement('div');fixture.id='qa-controls';fixture.style='position:fixed;top:10px;left:10px;z-index:9999';
  fixture.innerHTML='<a href="#" id="qa-a"><span>Link</span></a><button id="qa-button">Button</button><input id="qa-input"><textarea id="qa-textarea"></textarea><select id="qa-select"><option>One</option><option>Two</option></select><details><summary id="qa-summary">Summary</summary></details><div id="qa-editable" contenteditable="true">Edit</div>';
  document.body.append(fixture);
 });
 for(const id of ['a','button','input','textarea','select','summary','editable']) {
  await page.locator('#qa-'+id).focus();
  const baseline=await page.evaluate(()=>window.__qa.prevented.length);
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Space');
  assert.equal(await page.evaluate(()=>window.__qa.prevented.length),baseline,'Native '+id);
 }
 await page.evaluate(()=>document.querySelector('#qa-controls').remove());
 await scrollTime(nodes[8].hold+.02);
 // Escape exits special keyboard navigation; verify no explicit scroll tween.
 await stage.click({position:{x:60,y:300}});
 await page.keyboard.press('Escape');
 const writes=await page.evaluate(()=>window.__qa.scrollWrites.length);
 await page.keyboard.press('ArrowDown'); await page.waitForTimeout(250);
 assert.equal(await page.evaluate(()=>window.__qa.scrollWrites.length),writes);
 // Forward/reverse deterministic at the same pixel.
 const replay=labels.find(l=>l.id==='overview');
 await scrollTime(replay.time-1);
 const replayStyle=await page.locator('[data-replay-route]').getAttribute('style');
 assert.ok(await page.evaluate(()=>{const path=document.querySelector('[data-replay-route]'),cursor=document.querySelector('[data-cursor]');const at=path.getPointAtLength(+path.style.strokeDasharray- +path.style.strokeDashoffset);return Math.hypot(at.x- +cursor.dataset.x,at.y- +cursor.dataset.y)<.08}),'Replay cursor is the replay path head');
 await scrollTime(replay.time+.3); await scrollTime(replay.time-1);
 assert.equal(await page.locator('[data-replay-route]').getAttribute('style'),replayStyle);
 assert.deepEqual(await collisions(),[],'Replay connectors');
 await scrollTime(labels.find(l=>l.id==='final-overview').time+.1);
 assert.deepEqual(await collisions(),[],'Final overview connectors');
 await scrollTime(labels.find(l=>l.id==='exit').time+.02);
 const cursorBox=await page.locator('[data-cursor]').boundingBox();
 assert.ok(cursorBox.x+cursorBox.width<0,'Cursor exits viewport');
 await stage.evaluate(e=>window.scrollTo({top:+e.dataset.scrollEnd+200,behavior:'instant'}));await page.waitForTimeout(100);
 assert.notEqual(await stage.evaluate(e=>getComputedStyle(e).position),'fixed','Unpin');
 await page.screenshot({path:path.join(artifacts, 'philosophy-qa-exit.png')});

 for(const node of nodes.slice(1)) {
  const sample=node.travel+(node.arrive-node.travel)*.6;
  await scrollTime(sample);
  const snapshot=await page.evaluate(()=>({camera:document.querySelector('[data-camera]').style.transform,cursor:document.querySelector('[data-cursor]').outerHTML,path:document.querySelector('[data-route]').style.cssText,annotations:[...document.querySelectorAll('[data-annotation],[data-marker],[data-connector]')].map(e=>e.style.opacity)}));
  await scrollTime(node.hold+.1); await scrollTime(sample);
  assert.deepEqual(await page.evaluate(()=>({camera:document.querySelector('[data-camera]').style.transform,cursor:document.querySelector('[data-cursor]').outerHTML,path:document.querySelector('[data-route]').style.cssText,annotations:[...document.querySelectorAll('[data-annotation],[data-marker],[data-connector]')].map(e=>e.style.opacity)})),snapshot,node.id+' deterministic reverse');
 }
 for(const width of [320,390,768,1024]) {
  const beforeResize=await state();
  await page.setViewportSize({width,height:900}); await page.waitForTimeout(200);
  const afterResize=await state();
  assert.equal(afterResize.label,beforeResize.label,'Resize preserves narrative label');
  assert.ok(Math.abs(afterResize.y-beforeResize.y)<=1,'Resize preserves native scroll position '+width+' '+JSON.stringify({beforeResize,afterResize}));
  for(const id of ['info-distance-1','info-complexity-1','info-neutrality']) {
   await scrollTime(labels.find(l=>l.id===id).time+.1);
   const box=await page.locator('[data-annotation="'+id+'"]').boundingBox();
   assert.ok(box.x>=-1 && box.x+box.width<=width+1 && box.y>=0 && box.y+box.height<=901,'Responsive text '+width+' '+id+' '+JSON.stringify(box));
   assert.deepEqual(await collisions(),[],'Responsive connector '+width+' '+id);
   assert.equal(await page.locator('[data-annotation="'+id+'"]').evaluate(e=>e.scrollHeight>e.clientHeight),false,'Typography stays inside authored box');
  }
 }
 await page.setViewportSize({width:1440,height:900}); await page.waitForTimeout(100);
 console.log('PASS keyboard, button rewind, Escape, replay reverse, exit and unpin');
 // Dynamic reduced motion removes the pin and the entire cinematic stage.
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
 assert.equal(await page.locator('.pin-spacer').count(),0);
 assert.equal(await stage.evaluate(e=>e.getBoundingClientRect().height),0);
 assert.equal(await page.locator('article h1').isVisible(),true);
 assert.equal(await page.locator('[data-mode]').getAttribute('data-mode'),'static');
 await page.screenshot({path:path.join(artifacts, 'philosophy-qa-reduced.png')});
 await page.close();
 // Native touch scroll through the browser's input system, not JS swipe handlers.
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto(process.env.PHILOSOPHY_URL||'http://localhost:3000/philosophie');await mobile.locator('[data-mode=animated]').waitFor();
 await mobile.screenshot({path:path.join(artifacts, 'philosophy-qa-mobile-intro.png')});
 const cdp=await mobile.context().newCDPSession(mobile);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:650}]});
 for(let y=620;y>=250;y-=30)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(300);
 assert.ok(await mobile.evaluate(()=>window.scrollY>0),'Native emulated touch scroll');
 await mobile.emulateMedia({reducedMotion:'reduce'});await mobile.waitForTimeout(100);
 assert.equal(await mobile.locator('[data-philosophy-stage]').evaluate(e=>e.getBoundingClientRect().height),0);
 await mobile.close();

 for(const options of [{reducedMotion:'reduce'},{javaScriptEnabled:false}]) {
  const staticPage=await browser.newPage({viewport:{width:390,height:844},...options});
  staticPage.on('pageerror',e=>errors.push(e.message));
  await staticPage.goto(process.env.PHILOSOPHY_URL||'http://localhost:3000/philosophie');
  assert.equal(await staticPage.locator('.pin-spacer').count(),0);
  assert.equal(await staticPage.locator('[data-philosophy-stage]').evaluate(e=>e.getBoundingClientRect().height),0);
  assert.equal(await staticPage.locator('article h1').isVisible(),true);
  assert.equal(await staticPage.locator('article section').count(),14);
  await staticPage.screenshot({path:path.join(artifacts,options.javaScriptEnabled===false?'no-js.png':'reduced-initial.png')});
  await staticPage.close();
 }
 assert.deepEqual(errors,[]);
 console.log('PASS reduced motion, emulated touch; no browser errors');
 fs.writeFileSync(path.join(artifacts, 'philosophy-browser-results.json'),JSON.stringify({sceneCount:nodes.length,keyboard:true,rewind:true,nativeWheel:true,emulatedTouch:true,reducedMotion:true,errors},null,2));
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
