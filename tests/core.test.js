import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {md5,drillPacket,handshakeReply,containsDone,DONE} from '../js/protocol.js';
import {newDrill,validateDrill,backup,readBackup} from '../js/model.js';
import {Robot} from '../js/robot.js';
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
