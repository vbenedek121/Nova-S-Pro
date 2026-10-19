const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PONG_CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  if(!localStorage.getItem('beni-pongbot-hu-v1'))localStorage.setItem('beni-pongbot-hu-v1',JSON.stringify({format:'pongbot-hu',version:3,drills:[{id:'existing-v04',name:'Régi véletlen edzés',height:50,rounds:2,rest:1,balls:[{type:'top',speed:2,spin:1,drop:0,bpm:30,reps:7}],random:{type:true,direction:true,height:true,spin:1,min:-2,max:2,heightMin:48,heightMax:52}}]}));
  window.packets=[];let listener;const notify=data=>{const b=Uint8Array.from(data);listener?.({target:{value:new DataView(b.buffer)}});};window.robotDone=()=>notify([0,2,3,0,5,1,0]);
  const device=new EventTarget();device.name='Nova S Pro';const reader={startNotifications:async()=>{},addEventListener:(_,cb)=>listener=cb};
  const writer={writeValue:async bytes=>{window.packets.push([...bytes]);if(bytes[0]===7)queueMicrotask(()=>notify(new TextEncoder().encode('HEADER123456789012challenge')));else if([8,1,2].includes(bytes[0]))queueMicrotask(()=>notify([1]));}};
  device.gatt={connected:false,connect:async()=>{device.gatt.connected=true;return{getPrimaryService:async()=>({getCharacteristic:async id=>id.endsWith('ff01')?writer:reader})};},disconnect:()=>{device.gatt.connected=false;device.dispatchEvent(new Event('gattserverdisconnected'));}};
  Object.defineProperty(navigator,'bluetooth',{value:{requestDevice:async()=>device}});
 });
 await page.goto(process.env.PONG_URL||'http://127.0.0.1:8080');
 await page.locator('#remote-drill').selectOption('existing-v04');assert.match(await page.locator('#remote-modes').textContent(),/labdatípus.*oldalirány.*fel-le/);
 await page.locator('#show-editor').click();for(const id of ['type','direction','height'])assert.equal(await page.locator('#random-'+id).isChecked(),true);
 assert.equal(await page.locator('#mode').inputValue(),'rounds');assert.equal(await page.locator('[data-key="type"]').isDisabled(),true);assert.match(await page.locator('#incoming').textContent(),/véletlen/);
 await page.locator('#save').click();let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('beni-pongbot-hu-v1')));assert.equal(saved.version,4);assert.equal(saved.drills[0].random.height,true);assert.equal(saved.drills[0].balls[0].reps,7);
 await page.locator('#show-remote').click();await page.locator('#connect').click();await page.waitForFunction(()=>document.querySelector('#dot').classList.contains('on'));await page.clock.install();
 await page.locator('#start').click();await page.clock.runFor(5100);let packets=await page.evaluate(()=>window.packets.filter(p=>p[0]===129));assert.equal(packets[0].length,127);
 await page.evaluate(()=>window.robotDone());await page.clock.runFor(10);packets=await page.evaluate(()=>window.packets.filter(p=>p[0]===129));assert.equal(packets[1].length,55);
 await page.locator('#stop').click();await page.evaluate(()=>window.robotDone());await page.clock.runFor(5000);assert.equal(await page.evaluate(()=>window.packets.filter(p=>p[0]===129).length),2);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 await page.screenshot({path:'/tmp/pongbot-v05-remote.png',fullPage:true});
 console.log('PASS: existing v0.4 remote, v3 saved exercises and all random controls preserved; v4 export; 7 randomized physical balls dispatched as 5+2; STOP cancels continuation.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
