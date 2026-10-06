const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PONG_CHROMIUM_PATH || undefined});
 const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
 const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.packets=[];let listener;
  const notify=data=>{const u=Uint8Array.from(data);listener?.({target:{value:new DataView(u.buffer)}});};window.robotDone=()=>notify([0,2,3,0,5,1,0]);
  const device=new EventTarget();device.name='Nova S Pro – teszt';
  const reader={startNotifications:async()=>{},addEventListener:(_,cb)=>listener=cb};
  const writer={writeValue:async bytes=>{window.packets.push([...bytes]);if(bytes[0]===7)queueMicrotask(()=>notify(new TextEncoder().encode('HEADER123456789012challenge')));else if([8,1,2].includes(bytes[0]))queueMicrotask(()=>notify([1]));}};
  device.gatt={connected:false,connect:async()=>{device.gatt.connected=true;return{getPrimaryService:async()=>({getCharacteristic:async uuid=>uuid.endsWith('ff01')?writer:reader})};},disconnect:()=>{device.gatt.connected=false;device.dispatchEvent(new Event('gattserverdisconnected'));}};
  Object.defineProperty(navigator,'bluetooth',{value:{requestDevice:async()=>device},configurable:true});
 });
 await page.goto('http://localhost:8080');
 await page.locator('#name').fill('Beni – tenyeres / fonák');await page.locator('#rounds').fill('2');await page.locator('#rest').fill('2');
 await page.locator('#random-type').check();await page.locator('#random-direction').check();await page.locator('#random-full').click();await page.locator('#save').click();
 await page.reload();assert.equal(await page.locator('#name').inputValue(),'Két oldal váltva');
 await page.getByRole('button',{name:'Beni – tenyeres / fonák',exact:false}).click();assert.equal(await page.locator('#rounds').inputValue(),'2');
 assert.ok(await page.locator('#random-type').isChecked());assert.ok(await page.locator('#random-direction').isChecked());assert.equal(await page.locator('#random-min').inputValue(),'-10');assert.equal(await page.locator('#random-max').inputValue(),'10');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);await download.saveAs('/tmp/pongbot-backup-test.json');
 await page.locator('#file').setInputFiles('/tmp/pongbot-backup-test.json');await page.waitForFunction(()=>document.querySelectorAll('#library button').length===4);
 assert.ok(await page.locator('#random-type').isChecked());assert.ok(await page.locator('#random-direction').isChecked());
 assert.ok(await page.locator('#balls select').first().isDisabled());assert.ok(await page.locator('[data-key="drop"]').first().isDisabled());
 await page.locator('#connect').click();await page.waitForFunction(()=>document.querySelector('#connection').textContent.includes('teszt'));
 await page.clock.install();await page.locator('#test').click();await page.clock.fastForward(5100);
 await page.waitForFunction(()=>window.packets.some(p=>p[0]===129));
 let packets=await page.evaluate(()=>window.packets);assert.equal(packets.filter(x=>x[0]===129).at(-1).length,31);
 await page.evaluate(()=>window.robotDone());await page.waitForFunction(()=>window.packets.some(p=>p.join(',')==='128,1,0,1'));
 let count=await page.evaluate(()=>window.packets.filter(p=>p[0]===129).length);
 await page.locator('#start').click(); const rect=await page.locator('#stop').boundingBox(); assert.ok(rect.y>=0 && rect.y+rect.height<=844); await page.locator('#stop').click();await page.clock.fastForward(10000);
 assert.equal(await page.evaluate(()=>window.packets.filter(p=>p[0]===129).length),count);
 // Seven random balls per round must be 5+2, twice, with rest only between rounds.
 await page.locator('[data-key="reps"]').first().fill('7');
 await page.locator('#start').click();await page.clock.fastForward(5100);
 await page.waitForFunction(n=>window.packets.filter(p=>p[0]===129).length===n+1,count);
 const feedCount=()=>page.evaluate(()=>window.packets.filter(p=>p[0]===129).length);
 const done=async()=>{await page.evaluate(()=>window.robotDone());await page.clock.runFor(10);};
 await done();assert.equal(await feedCount(),count+2);
 await done();assert.equal(await feedCount(),count+2);assert.equal(await page.locator('#run-status').textContent(),'Körök közti szünet');
 await page.clock.runFor(2010);assert.equal(await feedCount(),count+3);
 await done();assert.equal(await feedCount(),count+4);
 await done();assert.equal(await page.locator('#notice').textContent(),'A gyakorlat befejeződött.');
 packets=await page.evaluate(()=>window.packets.filter(p=>p[0]===129));
 const randomPackets=packets.slice(count);assert.deepEqual(randomPackets.map(p=>(p.length-7)/24),[5,2,5,2]);
 for(const p of randomPackets){const v=new DataView(Uint8Array.from(p).buffer);for(let offset=7;offset<p.length;offset+=24){assert.equal(v.getUint32(offset+20,true),1);assert.ok(Math.abs(v.getFloat32(offset+12,true))<=22);}}
 // Stop after a completed batch but before the queued continuation.
 count=await feedCount();await page.locator('#start').click();await page.clock.fastForward(5100);
 await page.waitForFunction(n=>window.packets.filter(p=>p[0]===129).length===n+1,count);
 await page.evaluate(()=>{window.robotDone();document.querySelector('#stop').click();});
 await page.clock.runFor(60000);assert.equal(await feedCount(),count+1);
 // Missing completion must time out, never send the remaining random balls.
 count=await feedCount();await page.locator('#start').click();await page.clock.fastForward(5100);
 await page.waitForFunction(n=>window.packets.filter(p=>p[0]===129).length===n+1,count);
 await page.clock.runFor(40000);assert.equal(await feedCount(),count+1);assert.match(await page.locator('#notice').textContent(),/nem jelzett vissza/);
 // Single-ball mode must stay single even with seven random repetitions configured.
 count=await feedCount();await page.locator('#test').click();await page.clock.fastForward(5100);
 await page.waitForFunction(n=>window.packets.filter(p=>p[0]===129).length===n+1,count);
 assert.equal(await page.evaluate(()=>window.packets.filter(p=>p[0]===129).at(-1).length),31);await done();
 // A random spin above the motor range must be rejected before any feed starts.
 count=await feedCount();await page.locator('#random-spin').fill('10');await page.locator('#start').click();await page.clock.runFor(6000);
 assert.equal(await feedCount(),count);assert.match(await page.locator('#notice').textContent(),/legfeljebb/);await page.locator('#random-spin').fill('1');
 await page.locator('#start').click();await page.clock.fastForward(5100);await page.waitForFunction(n=>window.packets.filter(p=>p[0]===129).length>n,count);
 await page.locator('#stop').click();count=await page.evaluate(()=>window.packets.filter(p=>p[0]===129).length);await page.evaluate(()=>window.robotDone());await page.clock.fastForward(60000);
 assert.equal(await page.evaluate(()=>window.packets.filter(p=>p[0]===129).length),count);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'/tmp/pongbot-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1280,height:950});await page.screenshot({path:'/tmp/pongbot-desktop.png',fullPage:true});
 console.log('PASS: random settings save/reload/export/import, BLE handshake, finite 5+2 batches across two rounds, rest, single-ball random test, stop at batch boundary, watchdog, motor limits, mobile layout; no JS errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
