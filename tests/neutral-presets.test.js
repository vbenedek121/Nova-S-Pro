import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wheels,limitedSpin,drillPacket} from '../js/protocol.js';
import {newDrill,validateDrill,readBackup} from '../js/model.js';
import {PRESETS,presetDrill} from '../js/presets.js';
import {neutralTrim,validateCalibration,calibrationDrill} from '../js/calibration.js';
test('neutral strips stale backspin motors, including zero-spin legacy balls',()=>{
  for(const type of ['none','back','top']){
    const d=newDrill();Object.assign(d.balls[0],{type,spin:0,motor:{upper:1000,lower:3000}});
    const clean=validateDrill(d);assert.equal(clean.balls[0].type,'none');assert.equal(clean.balls[0].motor,undefined);
    const v=new DataView(drillPacket(clean).buffer);assert.equal(v.getUint32(7,true),v.getUint32(11,true));
    const corrected=new DataView(drillPacket(clean,()=>100).buffer);assert.equal(corrected.getUint32(7,true)-corrected.getUint32(11,true),200);
  }
});
test('neutral correction never modifies a spinning ball',()=>{
  for(const type of ['top','back']){const b={type,speed:2,spin:1};assert.deepEqual(wheels(b,100),wheels(b,0));}
});
test('native module reference vectors and restored sub-400 RPM support',()=>{
  assert.deepEqual(wheels({type:'top',speed:2,spin:6}),[4283,179]);
  assert.deepEqual(wheels({type:'none',speed:10,spin:0}),[7274,7274]);
  assert.equal(limitedSpin({speed:2}),6.5);
  for(let speed=0;speed<=10;speed+=.5){const spin=limitedSpin({speed});const rpm=wheels({type:'top',speed,spin});assert.ok(rpm.every(x=>x>=0&&x<=7500));}
  assert.throws(()=>wheels({type:'top',speed:0,spin:10}));
});
test('all 34 source presets and three levels validate, Push and Loop feed underspin',()=>{
  assert.equal(PRESETS.length,34);
  for(const p of PRESETS)for(const level of [1,2,3])for(const hand of ['right','left']){
    const d=validateDrill(presetDrill(p.code,level,hand));const packet=drillPacket(d);assert.equal(packet.length,7+d.balls.length*24);
    assert.equal(d.mode,'time');assert.equal(d.duration,300);assert.equal(d.rest,0);
    for(const ball of d.balls)assert.ok(wheels(ball).every(x=>x>=0&&x<=7500));
  }
  for(const code of ['push(b)','push(f)','loop(b)','loop(f)'])assert.equal(presetDrill(code).balls[0].type,'back');
  assert.deepEqual(wheels(presetDrill('push(b)').balls[0]),[1547,2915]);
  assert.equal(presetDrill('drive(f)').balls[0].type,'top');
  assert.equal(presetDrill('push(b)',1,'left').balls[0].drop,-presetDrill('push(b)',1,'right').balls[0].drop);
});
test('old backups gain rounds mode and reject contradictory motor directions',()=>{
  const d=newDrill();delete d.mode;delete d.duration;delete d.order;
  const [restored]=readBackup(JSON.stringify({format:'pongbot-hu',version:1,drills:[d]}));assert.equal(restored.mode,'rounds');
  Object.assign(d.balls[0],{type:'top',spin:2,motor:{upper:1000,lower:2000}});assert.throws(()=>validateDrill(d),/pörgetésirány/);
  const invalid=presetDrill('push(b)');invalid.preset.level=99;assert.throws(()=>validateDrill(invalid),/Edzésszint/);
});
test('calibration is bounded, interpolated and produces only one finite neutral ball',()=>{
  const profile=validateCalibration({2:100,5:-50});assert.equal(neutralTrim(profile,2),100);assert.equal(neutralTrim(profile,3.5),25);
  assert.equal(neutralTrim({},7.5),0);assert.throws(()=>validateCalibration({2:Infinity}));assert.throws(()=>validateCalibration({11:1}));
  const d=calibrationDrill(2,100);const v=new DataView(drillPacket(d).buffer);assert.equal(v.getUint32(27,true),1);assert.equal(v.getUint32(7,true)-v.getUint32(11,true),200);
  assert.throws(()=>calibrationDrill(2,0,NaN));
});
