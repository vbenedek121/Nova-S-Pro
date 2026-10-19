import {number} from './model.js?v=0.5';
// Robothoz tartozó, kizárólag üres labdára érvényes kerékegyensúly.
export const CALIBRATION_STORE='beni-pongbot-neutral-v1';
export function validateCalibration(data) {
  if(!data || typeof data!=='object' || Array.isArray(data))throw new Error('Hibás kerékegyensúly-adatok.');
  const out={};
  for(const [key,value] of Object.entries(data)) {
    const speed=Number(key);
    if(!Number.isFinite(speed)||speed<0||speed>10||!Number.isFinite(value)||Math.abs(value)>500)throw new Error('Hibás kerékegyensúly-érték.');
    out[String(speed)]=value;
  }return out;
}
export function neutralTrim(profile,speed) {
  if(Object.hasOwn(profile,String(speed)))return profile[String(speed)];
  const points=Object.entries({0:0,10:0,...profile}).map(([x,y])=>[Number(x),y]).sort((a,b)=>a[0]-b[0]);
  for(let i=1;i<points.length;i++)if(speed<=points[i][0]) {
    const [x0,y0]=points[i-1],[x1,y1]=points[i];return y0+(y1-y0)*(speed-x0)/(x1-x0);
  }return 0;
}
export function calibrationDrill(speed,trim,height=50) {
  number(speed,0,10,'Sebesség');number(trim,-500,500,'Kerékegyensúly');number(height,-50,100,'Ívmagasság');
  return {name:'Üres labda beállítása',height,rounds:1,rest:0,mode:'rounds',duration:300,order:'sequence',
    balls:[{type:'none',speed,spin:0,drop:0,bpm:30,reps:1}],neutralOverride:trim};
}
