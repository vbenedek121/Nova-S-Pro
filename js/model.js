export const VERSION = 1;
export const STORE = 'beni-pongbot-hu-v1';
export const copy = value => JSON.parse(JSON.stringify(value));
export function number(value, min, max, label, integer=false) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new Error(`${label}: ${min} és ${max} közötti ${integer ? 'egész ' : ''}szám szükséges.`);
  return value;
}
export function validateDrill(d) {
  if (!d || typeof d.name !== 'string' || !d.name.trim() || d.name.length > 60) throw new Error('Adj meg egy legfeljebb 60 karakteres nevet.');
  number(d.height,-50,100,'Ívmagasság');
  number(d.rounds,1,200,'Körök száma',true);
  number(d.rest,0,120,'Körök közti szünet');
  if (!Array.isArray(d.balls) || d.balls.length < 1 || d.balls.length > 5) throw new Error('Egy gyakorlat 1–5 labdabeállítást tartalmazhat.');
  const balls = d.balls.map(b => {
    if (!b || !['top','back','none'].includes(b.type)) throw new Error('Ismeretlen pörgetéstípus.');
    number(b.speed,0,10,'Sebesség'); number(b.spin,0,10,'Pörgetés');
    number(b.drop,-10,10,'Oldalirány'); number(b.bpm,30,90,'Labda/perc',true); number(b.reps,1,20,'Labdaismétlés',true);
    return {type:b.type,speed:b.speed,spin:b.type==='none'?0:b.spin,drop:b.drop,bpm:b.bpm,reps:b.reps};
  });
  return {id:typeof d.id==='string' ? d.id.slice(0,80) : crypto.randomUUID(),name:d.name.trim(),height:d.height,rounds:d.rounds,rest:d.rest,balls};
}
export function readBackup(text) {
  const data=JSON.parse(text);
  if (data?.format!=='pongbot-hu' || data.version!==VERSION || !Array.isArray(data.drills) || data.drills.length<1 || data.drills.length>300) throw new Error('Ez nem támogatott Pongbot HU mentés.');
  return data.drills.map(validateDrill);
}
export function backup(drills) {
  return JSON.stringify({format:'pongbot-hu',version:VERSION,created:new Date().toISOString(),drills:drills.map(validateDrill)},null,2);
}
export function newDrill() {
  return {id:crypto.randomUUID(),name:'Új gyakorlat',height:50,rounds:10,rest:3,balls:[{type:'top',speed:2,spin:1,drop:0,bpm:30,reps:1}]};
}
export function examples() {
  const a=newDrill(); a.name='Középre – próba'; a.rounds=1;
  const b=newDrill(); b.name='Két oldal váltva'; b.balls=[{...b.balls[0],drop:-4},{...b.balls[0],drop:4}];
  return [a,b];
}
