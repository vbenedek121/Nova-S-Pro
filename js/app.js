import {STORE,copy,validateDrill,readBackup,backup,newDrill,examples} from './model.js';
import {limitedSpin} from './protocol.js';
import {Robot} from './robot.js';
const $=id=>document.getElementById(id), robot=new Robot();
let drills=[],current,dirty=false,storageBroken=false,session=null,epoch=0,wake=null;
function message(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
try {const text=localStorage.getItem(STORE);drills=text?readBackup(text):examples();} catch {storageBroken=true;drills=examples();message('A korábbi mentés nem olvasható. Az eredetit nem írom felül. Előbb exportáld a mostani gyakorlatokat, vagy állítsd helyre a korábbi mentést.',true);}
function persist(next){if(storageBroken)throw new Error('A böngésző mentése nem olvasható. Használd a Mentés fájlba lehetőséget.');localStorage.setItem(STORE,backup(next));drills=next;}
function changed(){dirty=true;$('saved').textContent='Nincs elmentve';}
function abandon(){return !dirty || confirm('A módosítások nincsenek elmentve. Elveted őket?');}
function library(){
  $('library').replaceChildren();
  for(const d of drills){const button=document.createElement('button');button.className='drill'+(d.id===current?.id?' selected':'');button.textContent=d.name;const info=document.createElement('span');info.textContent=`${d.balls.length} beállítás · ${d.rounds} kör`;button.append(info);button.disabled=!!session;button.onclick=()=>{if(abandon())select(d);};$('library').append(button);}
}
function select(d){current=copy(d);dirty=false;render();}
function render(){
  for(const k of ['name','height','rounds','rest'])$(k).value=current[k];
  $('saved').textContent=dirty?'Nincs elmentve':'Mentve';renderBalls();library();controls();
}
function numberField(ball,key,label,min,max,step){
  const l=document.createElement('label');l.textContent=label;
  const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step=step;input.value=ball[key];input.dataset.key=key;
  input.oninput=()=>{ball[key]=input.value===''?NaN:Number(input.value);changed();};l.append(input);return l;
}
function renderBalls(){
  $('balls').replaceChildren();
  current.balls.forEach((ball,index)=>{
    const card=document.createElement('div');card.className='ball';
    const head=document.createElement('div');head.className='ball-head';const title=document.createElement('span');title.className='ball-title';title.textContent=`${String(index+1).padStart(2,'0')} / LABDA`;
    const del=document.createElement('button');del.className='text-button';del.textContent='Eltávolítás';del.disabled=current.balls.length===1;del.onclick=()=>{current.balls.splice(index,1);changed();renderBalls();};head.append(title,del);
    const fields=document.createElement('div');fields.className='ball-fields';const label=document.createElement('label');label.textContent='Labda típusa';const type=document.createElement('select');
    for(const [value,text] of [['top','Pörgetett'],['back','Nyesett'],['none','Pörgetés nélkül']]){const op=new Option(text,value);type.append(op);}type.value=ball.type;type.onchange=()=>{ball.type=type.value;if(ball.type==='none')ball.spin=0;changed();renderBalls();};label.append(type);fields.append(label);
    fields.append(numberField(ball,'speed','Sebesség (0–10)',0,10,.5),numberField(ball,'spin','Pörgetés (0–10)',0,10,.5),numberField(ball,'drop','Oldalirány (−10…+10)',-10,10,.5),numberField(ball,'bpm','Labda / perc',30,90,1),numberField(ball,'reps','Egymás utáni labdák',1,20,1));
    fields.querySelector('[data-key="spin"]').disabled=ball.type==='none';card.append(head,fields);$('balls').append(card);
  });$('add').disabled=current.balls.length>=5;
}
function draft(){
  const d=validateDrill(current);
  for(const ball of d.balls)if(ball.type!=='none' && ball.spin>limitedSpin(ball))throw new Error(`Ehhez a sebességhez legfeljebb ${limitedSpin(ball)} pörgetést állíts be.`);
  return d;
}
function save(asCopy=false){
  try {const d=draft();if(asCopy){d.id=crypto.randomUUID();d.name=(d.name+' – másolat').slice(0,60);}const next=drills.filter(x=>x.id!==d.id);next.push(d);if(next.length>300)throw new Error('Legfeljebb 300 gyakorlat tárolható.');persist(next);select(d);message('A gyakorlat elmentve ebben a böngészőben.');}catch(e){message(e.message,true);}
}
for(const key of ['name','height','rounds','rest'])$(key).oninput=()=>{current[key]=key==='name'?$(key).value:($(key).value===''?NaN:Number($(key).value));changed();};
$('new').onclick=()=>{if(abandon()){select(newDrill());changed();}};
$('add').onclick=()=>{if(current.balls.length<5){current.balls.push(copy(current.balls.at(-1)));changed();renderBalls();}};
$('save').onclick=()=>save();$('duplicate').onclick=()=>save(true);
$('delete').onclick=()=>{if(!confirm(`Törlöd ezt a gyakorlatot: ${current.name}?`))return;try{const next=drills.filter(x=>x.id!==current.id);if(!next.length)next.push(newDrill());persist(next);select(next[0]);message('A gyakorlat törölve.');}catch(e){message(e.message,true);}};
function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=()=>{try{const d=draft(),all=drills.filter(x=>x.id!==d.id);all.push(d);download(backup(all),'pongbot-hu-mentes.json');message('A mentési fájl elkészült, a jelenlegi módosításokat is tartalmazza.');}catch(e){message(e.message,true);}};
$('import').onclick=()=>$('file').click();
$('file').onchange=async()=>{
  const file=$('file').files[0];$('file').value='';if(!file)return;
  try{if(file.size>2000000)throw new Error('Túl nagy mentési fájl (legfeljebb 2 MB).');const incoming=readBackup(await file.text());if(!abandon())return;if(drills.length+incoming.length>300)throw new Error('A betöltéssel túllépnéd a 300 gyakorlatot.');const next=[...drills,...incoming.map(x=>({...x,id:crypto.randomUUID()}))];persist(next);select(next.at(-1));message(`${incoming.length} gyakorlat betöltve. A meglévők megmaradtak.`);}catch(e){message('Nem sikerült betölteni: '+e.message,true);}
};
function controls(){
  const active=!!session;
  $('editor').disabled=active;$('new').disabled=active;$('import').disabled=active;$('export').disabled=active;
  $('connect').disabled=active;$('connect').textContent=robot.ready?'Kapcsolat bontása':'Kapcsolódás';
  $('test').disabled=!robot.ready||active;$('start').disabled=!robot.ready||active;$('stop').disabled=!robot.ready&&!active;
  document.querySelector('.run-panel').classList.toggle('active',active);library();
  document.body.classList.toggle('running',active);
}
$('connect').onclick=async()=>{
  if(robot.ready){robot.disconnect();return;}$('connect').disabled=true;$('connection').textContent='Kapcsolódás…';
  try{await robot.connect();message('Kapcsolódva. Az első ellenőrzéshez válaszd az „1 labda próba” gombot.');}catch(e){message(e.name==='NotFoundError'?'Nem választottál robotot.':e.message,true);$('connection').textContent='Nincs kapcsolat';}finally{controls();}
};
robot.addEventListener('connected',e=>{$('connection').textContent=e.detail;$('dot').classList.add('on');controls();});
robot.addEventListener('disconnected',()=>{const active=!!session;reset();$('connection').textContent='Nincs kapcsolat';$('dot').classList.remove('on');controls();message(active?'Megszakadt a kapcsolat. A robot leállása nem igazolható; ha még adogat, kapcsold ki.':'A kapcsolat bontva.',active);});
robot.addEventListener('error',e=>message(e.detail,true));
function reset(){epoch++;if(session){clearTimeout(session.timer);clearTimeout(session.watchdog);}session=null;wake?.release().catch(()=>{});wake=null;$('run-status').textContent='Készen állsz?';$('run-detail').textContent='A következő indítás 5 másodperc visszaszámlálással kezdődik.';controls();}
async function stop(text='Leállítva.'){
  reset();try{const sent=await robot.stop();message(sent?text:'Nincs kapcsolat: leállítási parancs nem küldhető.',!sent);}catch(e){message('Nem sikerült elküldeni a leállítást. Ha a robot adogat, kapcsold ki. '+e.message,true);robot.disconnect();}
}
$('stop').onclick=()=>stop();
async function start(single=false){
  if(session || !robot.ready)return;
  try{let d=draft();if(single)d={...d,rounds:1,balls:[{...d.balls[0],reps:1}],rest:0};
    const token=++epoch;session={d,token,completed:0,pending:false,timer:null,watchdog:null};controls();
    if(navigator.wakeLock){navigator.wakeLock.request('screen').then(lock=>{if(session?.token===token)wake=lock;else lock.release();}).catch(()=>{});}
    let seconds=5;const tick=()=>{if(session?.token!==token)return;if(seconds===0){runRound();return;}$('run-status').textContent=`Indulás ${seconds}…`;$('run-detail').textContent=single?'Egy labda az első beállítással.':d.name;seconds--;session.timer=setTimeout(tick,1000);};tick();
  }catch(e){message(e.message,true);}
}
async function runRound(){
  const s=session;if(!s || s.pending)return;s.pending=true;
  $('run-status').textContent=`${s.completed+1}. kör / ${s.d.rounds}`;$('run-detail').textContent=s.d.name;
  // A finite sequence is always sent. No completion response => stop, never repeat blindly.
  const expected=s.d.balls.reduce((sum,b)=>sum+b.reps*60000/b.bpm,0);
  s.watchdog=setTimeout(()=>{if(session===s)stop('A robot nem jelzett vissza időben. Az edzés leállítva.');},expected+20000);
  try{await robot.run(s.d);}catch(e){if(session===s)await stop('Leállítva: '+e.message);}
}
robot.addEventListener('done',()=>{
  const s=session;if(!s?.pending)return;s.pending=false;clearTimeout(s.watchdog);s.completed++;
  if(s.completed>=s.d.rounds){stop('A gyakorlat befejeződött.');return;}
  $('run-status').textContent='Körök közti szünet';$('run-detail').textContent=`${s.completed} kör kész · ${s.d.rest} másodperc pihenő`;
  s.timer=setTimeout(()=>{if(session===s)runRound();},s.d.rest*1000);
});
$('start').onclick=()=>start();$('test').onclick=()=>start(true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&session)stop('Az edzés leállítva, mert a lap háttérbe került.');});
window.addEventListener('pagehide',()=>{if(session)stop();});
window.addEventListener('beforeunload',e=>{if(dirty||session){e.preventDefault();e.returnValue='';}});
select(drills[0]);
if(!window.isSecureContext || !navigator.bluetooth)message('A szerkesztés működik. Robotvezérléshez Androidon Chrome-ban, HTTPS webcímen nyisd meg az oldalt.');
