export const VERSION = 4;
export const STORE = 'beni-pongbot-hu-v1';
export const copy = value => JSON.parse(JSON.stringify(value));
export const randomDefaults = (height=50) => ({type:false,direction:false,height:false,spin:1,min:-4,max:4,heightMin:Math.max(-50,Math.round(height)-5),heightMax:Math.min(100,Math.round(height)+5)});
export function number(value, min, max, label, integer=false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new Error(`${label}: ${min} és ${max} közötti ${integer ? 'egész ' : ''}szám szükséges.`);
  return value;
}
export function validateDrill(d) {
  if (!d || typeof d.name !== 'string' || !d.name.trim() || d.name.length > 100) throw new Error('Adj meg egy legfeljebb 100 karakteres nevet.');
  number(d.height,-50,100,'Ívmagasság');
  number(d.rounds,1,200,'Körök száma',true);
  number(d.rest,0,120,'Körök közti szünet');
  if (d.random!==undefined && (!d.random || typeof d.random!=='object' || Array.isArray(d.random))) throw new Error('Hibás véletlen beállítások.');
  const random={...randomDefaults(d.height),...d.random};
  if (typeof random.type!=='boolean' || typeof random.direction!=='boolean' || typeof random.height!=='boolean') throw new Error('Hibás véletlen kapcsoló.');
  number(random.heightMin,-50,100,'Ívmagasság alsó határa',true);number(random.heightMax,-50,100,'Ívmagasság felső határa',true);
  if (random.heightMin>random.heightMax) throw new Error('Az ívmagasság alsó határa nem lehet nagyobb a felsőnél.');
  number(random.spin,.5,10,'Véletlen pörgetés erőssége');
  number(random.min,-10,10,'Oldalirány alsó határa');number(random.max,-10,10,'Oldalirány felső határa');
  if (random.min>random.max || !Number.isInteger(random.min*2) || !Number.isInteger(random.max*2)) throw new Error('Az oldalirány határai fél lépésenként adhatók meg, az alsó nem lehet nagyobb a felsőnél.');
  if (!Array.isArray(d.balls) || d.balls.length < 1 || d.balls.length > 5) throw new Error('Egy gyakorlat 1–5 labdabeállítást tartalmazhat.');
  const balls = d.balls.map(b => {
    if (!b || !['top','back','none'].includes(b.type)) throw new Error('Ismeretlen pörgetéstípus.');
    number(b.speed,0,10,'Sebesség'); number(b.spin,0,10,'Pörgetés');
    number(b.drop,-10,10,'Oldalirány'); number(b.bpm,30,90,'Labda/perc',true); number(b.reps,1,20,'Labdaismétlés',true);
    const neutral=b.type==='none'||b.spin===0;
    const out={type:neutral?'none':b.type,speed:b.speed,spin:neutral?0:b.spin,drop:b.drop,bpm:b.bpm,reps:b.reps};
    if(!neutral && b.motor){
      number(b.motor.upper,0,7500,'Felső kerék',true);number(b.motor.lower,0,7500,'Alsó kerék',true);
      if((b.type==='top'&&b.motor.upper<b.motor.lower)||(b.type==='back'&&b.motor.upper>b.motor.lower))throw new Error('A mentett kerékérték nem egyezik a labda pörgetésirányával.');
      out.motor={upper:b.motor.upper,lower:b.motor.lower};
    }
    return out;
  });
  const mode=d.mode??'rounds',duration=d.duration??300,order=d.order??'sequence';
  if(!['rounds','time'].includes(mode)||!['sequence','random'].includes(order))throw new Error('Ismeretlen edzésmód.');
  number(duration,10,3600,'Edzésidő',true);
  const out={id:typeof d.id==='string' ? d.id.slice(0,80) : crypto.randomUUID(),name:d.name.trim(),height:d.height,rounds:d.rounds,rest:d.rest,balls,mode,duration,order,random:{type:random.type,direction:random.direction,spin:random.spin,min:random.min,max:random.max,height:random.height,heightMin:random.heightMin,heightMax:random.heightMax}};
  if(d.preset && typeof d.preset.code==='string'){
    number(d.preset.level,1,3,'Edzésszint',true);
    if(!['left','right'].includes(d.preset.hand))throw new Error('Ismeretlen ütőt tartó kéz.');
    out.preset={code:d.preset.code.slice(0,80),level:d.preset.level,hand:d.preset.hand};
  }
  return out;
}
export function readBackup(text) {
  const data=JSON.parse(text);
  if (data?.format!=='pongbot-hu' || ![1,2,3,VERSION].includes(data.version) || !Array.isArray(data.drills) || data.drills.length<1 || data.drills.length>300) throw new Error('Ez nem támogatott Pongbot HU mentés.');
  return data.drills.map(validateDrill);
}
export function backup(drills) {
  return JSON.stringify({format:'pongbot-hu',version:VERSION,created:new Date().toISOString(),drills:drills.map(validateDrill)},null,2);
}
export function newDrill() {
  return {id:crypto.randomUUID(),name:'Új gyakorlat',height:50,rounds:30,rest:0,mode:'time',duration:300,order:'sequence',balls:[{type:'top',speed:2,spin:1,drop:0,bpm:30,reps:1}],random:randomDefaults()};
}
export function examples() {
  const a=newDrill(); a.name='Középre – próba'; a.rounds=1;a.mode='rounds';
  const b=newDrill(); b.name='Két oldal váltva'; b.balls=[{...b.balls[0],drop:-4},{...b.balls[0],drop:4}];
  return [a,b];
}
