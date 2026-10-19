import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {md5,drillPacket,handshakeReply,containsDone,DONE} from '../js/protocol.js';
import {newDrill,validateDrill,backup,readBackup} from '../js/model.js';
import {Robot} from '../js/robot.js';
import {roundBatches} from '../js/sequence.js';
test('pairing digest follows RFC1321 for ASCII and UTF8 at padding boundaries',()=>{
  for(const text of ['', 'abc', 'árvíztűrő tükörfúrógép',...Array.from({length:130},(_,i)=>'x'.repeat(i))])assert.equal(md5(text),createHash('md5').update(text).digest('hex'));
});
test('handshake response contains exactly 32 digest characters after header',()=>{
  const result=handshakeReply(new TextEncoder().encode('HEADER123456789012challenge'));
  assert.equal(result.length,35);assert.deepEqual([...result.slice(0,3)],[8,32,0]);
  assert.match(new TextDecoder().decode(result.slice(3)),/^[0-9a-f]{32}$/);
  assert.throws(()=>handshakeReply(new Uint8Array(2)));
});
test('backup roundtrip retains Hungarian names and settings',()=>{
  const d=newDrill();d.name='Nyesettre indulás';d.balls[0].bpm=45;d.rest=7;
  assert.deepEqual(readBackup(backup([d])),[d]);
});
test('malformed import is rejected before any storage is changed',()=>{
  const d=newDrill();d.balls[0].bpm=0;assert.throws(()=>validateDrill(d));
  d.balls[0].bpm=30;d.balls[0].reps=1.5;assert.throws(()=>validateDrill(d));
  d.balls[0].reps=1;d.rounds=Infinity;assert.throws(()=>validateDrill(d));
  assert.throws(()=>readBackup('{"format":"wrong","version":1,"drills":[]}'));
});
test('wire packet uses finite single round and correct motor/direction/frequency values',()=>{
  const d=newDrill();d.height=50;d.balls=[{type:'top',speed:2,spin:1,drop:-5,bpm:30,reps:1},{type:'back',speed:2,spin:1,drop:5,bpm:90,reps:2}];
  const b=drillPacket(d),v=new DataView(b.buffer);
  assert.equal(b.length,55);assert.deepEqual([...b.slice(0,7)],[129,52,0,1,1,0,0]);
  assert.equal(v.getUint32(7,true),2573);assert.equal(v.getUint32(11,true),1889);
  assert.equal(v.getFloat32(19,true),-11);assert.equal(v.getFloat32(23,true),.5);assert.equal(v.getUint32(27,true),1);
  assert.equal(v.getUint32(31,true),1889);assert.equal(v.getUint32(35,true),2573);assert.equal(v.getFloat32(43,true),11);assert.equal(v.getFloat32(47,true),1.5);
  assert.ok(containsDone(DONE));assert.ok(!containsDone(DONE.slice(1)));
});
test('STOP cancels queued feeding packets, follows in-flight operation, and does not swallow failures',async()=>{
  const r=new Robot(),sent=[];let release;
  r.device={gatt:{connected:true}};r.writer={writeValue:async b=>{sent.push([...b]);if(b[0]===9)await new Promise(ok=>release=ok);}};
  const first=r.write(new Uint8Array([9]));await new Promise(ok=>setImmediate(ok));
  const feed=r.write(new Uint8Array([129]));const stop=r.stop();release();await Promise.all([first,feed,stop]);
  assert.deepEqual(sent,[[9],[128,1,0,1]]);
  r.writer={writeValue:async()=>{throw new Error('test transport failure');}};await assert.rejects(r.stop(),/transport failure/);
});
test('old backups migrate with random modes off; new options survive export/import',()=>{
  const d=newDrill();delete d.random;
  const migrated=readBackup(JSON.stringify({format:'pongbot-hu',version:1,drills:[d]}))[0];
  assert.deepEqual(migrated.random,{type:false,direction:false,spin:1,min:-4,max:4,height:false,heightMin:45,heightMax:55});
  migrated.random={...migrated.random,type:true,direction:true,spin:2,min:-10,max:10};
  assert.deepEqual(readBackup(backup([migrated])),[migrated]);
  for(const bad of [{min:5,max:-5},{min:-11},{max:10.5},{min:.1},{spin:0},{type:'yes'},{direction:1}])assert.throws(()=>validateDrill({...migrated,random:{...migrated.random,...bad}}));
});
test('random types map to backspin, empty and topspin motor commands independently per ball',()=>{
  const d=newDrill();d.random.type=true;d.balls[0].reps=3;
  const values=[0,.5,.999999];const batches=roundBatches(d,()=>values.shift());
  assert.deepEqual(batches[0].balls.map(b=>[b.type,b.spin,b.reps]),[['back',1,1],['none',0,1],['top',1,1]]);
  const wire=drillPacket(batches[0]),v=new DataView(wire.buffer);
  assert.ok(v.getUint32(7,true)<v.getUint32(11,true));
  assert.equal(v.getUint32(31,true),v.getUint32(35,true));
  assert.ok(v.getUint32(55,true)>v.getUint32(59,true));
  assert.ok(batches[0].balls.every(b=>b.drop===0&&b.speed===2&&b.bpm===30));
  assert.equal(d.balls[0].reps,3);assert.equal(d.balls[0].type,'top');
});
test('direction draws cover both bounds at half steps without changing spin or speed',()=>{
  const d=newDrill();d.random.direction=true;d.random.min=-10;d.random.max=10;d.balls[0].reps=3;
  const values=[0,.5,.999999];let balls=roundBatches(d,()=>values.shift())[0].balls;
  assert.deepEqual(balls.map(b=>b.drop),[-10,0,10]);
  assert.ok(balls.every(b=>b.type==='top'&&b.spin===1&&b.speed===2));
  d.random.min=1.5;d.random.max=1.5;
  balls=roundBatches(d,()=>.9)[0].balls;assert.ok(balls.every(b=>b.drop===1.5));
});
test('combined random expands all repeats into finite batches, rerolls each round and keeps source intact',()=>{
  const d=newDrill();d.random.type=true;d.random.direction=true;
  d.balls=Array.from({length:5},(_,i)=>({...d.balls[0],reps:20,speed:2+i/2,bpm:30+i}));
  const before=structuredClone(d);let n=0;
  const batches=roundBatches(d,()=>((n++*37)%101)/101);
  assert.equal(batches.length,20);assert.equal(batches.flatMap(b=>b.balls).length,100);
  for(const batch of batches){assert.equal(batch.balls.length,5);const p=drillPacket(batch);assert.equal(p.length,127);assert.equal(p[4],1);
    assert.ok(batch.balls.every(b=>b.reps===1&&b.drop>=-4&&b.drop<=4&&Number.isInteger(b.drop*2)));}
  assert.notDeepEqual(roundBatches(d,()=>.01),roundBatches(d,()=>.99));
  assert.deepEqual(d,before);
  d.random.type=false;d.random.direction=false;
  assert.deepEqual(roundBatches(d)[0].balls,d.balls);assert.equal(roundBatches(d).length,1);
});

test('height-only mode draws per ball, uses per-ball wire heights and preserves other settings',()=>{
  const d=newDrill();d.random.height=true;d.random.heightMin=-50;d.random.heightMax=100;d.balls[0].reps=3;
  const before=structuredClone(d), values=[0,.5,.999999];
  const batch=roundBatches(d,()=>values.shift())[0];
  assert.deepEqual(batch.balls.map(b=>b.height),[-50,25,100]);
  assert.ok(batch.balls.every(b=>b.type==='top'&&b.spin===1&&b.drop===0&&b.speed===2&&b.bpm===30&&b.reps===1));
  const v=new DataView(drillPacket(batch).buffer);
  assert.deepEqual([15,39,63].map(p=>v.getFloat32(p,true)),[-20,5,30]);
  assert.deepEqual(d,before);
  d.random.height=false;
  const fixed=new DataView(drillPacket(roundBatches(d)[0]).buffer);
  assert.ok(Math.abs(fixed.getFloat32(15,true)-((d.height+50)/3-20))<0.00001);
});
test('height settings migrate, persist and reject invalid bounds',()=>{
  const d=newDrill();d.height=80;delete d.random.height;delete d.random.heightMin;delete d.random.heightMax;
  d.random.type=true;d.random.direction=true;
  const migrated=readBackup(JSON.stringify({format:'pongbot-hu',version:2,drills:[d]}))[0];
  assert.equal(migrated.random.height,false);assert.equal(migrated.random.heightMin,75);assert.equal(migrated.random.heightMax,85);
  assert.equal(migrated.random.type,true);assert.equal(migrated.random.direction,true);
  migrated.random.height=true;assert.deepEqual(readBackup(backup([migrated])),[migrated]);
  for(const bad of [{height:'yes'},{heightMin:-51},{heightMax:101},{heightMin:80.5},{heightMin:90,heightMax:70},{heightMin:NaN}])assert.throws(()=>validateDrill({...migrated,random:{...migrated.random,...bad}}));
  migrated.random.heightMin=50;migrated.random.heightMax=50;
  assert.equal(roundBatches(migrated,()=>.9)[0].balls[0].height,50);
});

