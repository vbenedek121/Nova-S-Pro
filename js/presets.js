import {PRESETS} from './presets-data.js?v=0.5';
import {newDrill} from './model.js?v=0.5';
import {MOTOR_BASE,MOTOR_SPEED,MOTOR_SPIN} from './protocol.js?v=0.5';
export {PRESETS};
export const CATEGORIES=[['basic','Alap','Basic'],['combined','Kombinált','Combined'],['complex','Összetett','Complex']];
export function presetDrill(code,level=1,hand='right') {
  const p=PRESETS.find(x=>x.code===code);
  if(!p || ![1,2,3].includes(level))throw new Error('Ismeretlen edzés vagy szint.');
  const d=newDrill();d.name=p.english+' · '+p.hu;d.name=d.name.slice(0,100);
  d.preset={code,level,hand};d.height=p.levels[level][0][2];d.rest=0;d.mode='time';d.duration=300;d.order=p.random?'random':'sequence';
  d.balls=p.levels[level].map(([upper,lower,height,drop,freq,reps])=>({
    type:upper===lower?'none':upper>lower?'top':'back',
    speed:Math.max(0,Math.min(10,Math.round(((upper+lower)/2-MOTOR_BASE)/MOTOR_SPEED*2)/2)),
    spin:Math.round(Math.abs(upper-lower)/2/MOTOR_SPIN*2)/2,
    drop:drop*(hand==='left'?-1:1),bpm:Math.round(30+freq*.6),reps,
    motor:{upper,lower}
  }));return d;
}
export function incoming(drill) {
  const types=[...new Set(drill.balls.map(x=>x.spin===0?'none':x.type))];
  return types.map(t=>({back:'nyesett',top:'pörgetett',none:'üres'}[t])).join(' + ');
}
