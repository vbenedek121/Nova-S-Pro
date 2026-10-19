import {STORE,copy,validateDrill,readBackup,backup,newDrill,examples} from './model.js?v=0.5';
import {limitedSpin,wheels} from './protocol.js?v=0.5';
import {Robot} from './robot.js?v=0.5';
import {roundBatches} from './sequence.js?v=0.5';
import {PRESETS,CATEGORIES,presetDrill,incoming} from './presets.js?v=0.5';
import {CALIBRATION_STORE,validateCalibration,neutralTrim,calibrationDrill} from './calibration.js?v=0.5';
const $=id=>document.getElementById(id),robot=new Robot();
let drills=[],current,dirty=false,storageBroken=false,session=null,epoch=0,wake=null;
let category='basic',profile={},level=1,hand='right';
function message(text,error=false){$('notice').textContent=text;$('notice').classList.toggle('error',error);}
try{const text=localStorage.getItem(STORE);drills=text?readBackup(text):examples();}
catch{storageBroken=true;drills=examples();message('A korábbi mentés nem olvasható. A mentési fájlt töltsd vissza; a meglévő adatot nem írjuk felül.',true);}
try{profile=validateCalibration(JSON.parse(localStorage.getItem(CALIBRATION_STORE)||'{}'));}
catch{message('Az üreslabda-beállítás nem olvasható. Állítsd be újra a kerékegyensúlyt.',true);}
const correction=speed=>neutralTrim(profile,speed);
function persist(next){if(storageBroken)throw new Error('A korábbi tárolt adat hibás. Használd a fájlba mentést.');localStorage.setItem(STORE,backup(next));drills=next;}
function changed(){dirty=true;$('saved').textContent='Nincs elmentve';renderRemote();}
function abandon(){return !dirty||confirm('A módosítások nincsenek elmentve. Elveted őket?');}
function library(){
  $('library').replaceChildren();
  for(const d of drills){
    const b=document.createElement('button');b.className='drill'+(d.id===current?.id?' selected':'');b.textContent=d.name;
    const small=document.createElement('span');small.textContent=`${d.balls.length} labdabeállítás · ${d.mode==='time'?d.duration+' mp':d.rounds+' kör'}`;b.append(small);b.disabled=!!session;
    b.onclick=()=>{if(abandon())select(d);};$('library').append(b);
  }
}
function catalog(){
  $('catalog').replaceChildren();const query=$('search').value.toLocaleLowerCase('hu');
  const rows=PRESETS.filter(p=>p.category===category&&(`${p.hu} ${p.english}`).toLocaleLowerCase('hu').includes(query));
  for(const p of rows){
    const b=document.createElement('button');b.className='drill'+(current?.preset?.code===p.code?' selected':'');b.dataset.preset=p.code;
    const english=document.createElement('strong');english.textContent=p.english;
    const hu=document.createElement('span');hu.textContent=p.hu;b.append(english,hu);b.disabled=!!session;
    b.onclick=()=>{if(abandon())select(presetDrill(p.code,level,hand));};$('catalog').append(b);
  }
  $('catalog').hidden=category==='mine';$('search').hidden=category==='mine';$('catalog-empty').hidden=category==='mine'||rows.length>0;
  $('library').hidden=category!=='mine';
  document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('selected',b.dataset.category===category);b.setAttribute('aria-pressed',String(b.dataset.category===category));b.disabled=!!session;});
  $('catalog-count').textContent=category==='mine'?`${drills.length} mentett gyakorlat`:`${rows.length} edzésminta`;
}
let view='remote';
const runPanel=document.querySelector('.run-panel');
function showView(next){
  if(session&&next!=='remote')return;
  view=next;const remote=next==='remote';
  $('remote').hidden=!remote;$('editor-view').hidden=remote;
  document.body.classList.toggle('remote-mode',remote);
  $('show-remote').setAttribute('aria-pressed',String(remote));$('show-editor').setAttribute('aria-pressed',String(!remote));
  $(remote?'remote-run-slot':'editor-run-slot').append(runPanel);
  renderRemote();window.scrollTo({top:0,behavior:'instant'});
}
function renderRemote(){
  if(!current)return;
  const picker=$('remote-drill');picker.replaceChildren();
  for(const d of drills)picker.append(new Option(d.id===current.id&&dirty?current.name+' (módosítva)':d.name,d.id));
  if(!drills.some(d=>d.id===current.id))picker.append(new Option(current.name+' (nincs mentve)',current.id));
  for(const [id,hu] of CATEGORIES){const group=document.createElement('optgroup');group.label=hu;for(const p of PRESETS.filter(p=>p.category===id))group.append(new Option(p.english+' · '+p.hu,'preset:'+p.code));picker.append(group);}
  picker.value=current.id;picker.disabled=!!session;
  $('remote-saved').textContent=dirty?'Nincs elmentve':drills.some(d=>d.id===current.id)?'Mentett edzés':'Edzésminta';
  $('remote-rounds').textContent=current.mode==='time'?current.duration/60:current.rounds;$('remote-measure').textContent=current.mode==='time'?'perc':'kör';
  $('remote-balls').textContent=current.balls.reduce((sum,b)=>sum+(Number.isFinite(b.reps)?b.reps:0),0);
  $('remote-rest').textContent=Number.isFinite(current.rest)?current.rest:'—';
  const modes=[['type','labdatípus'],['direction','oldalirány'],['height','fel-le']].filter(([key])=>current.random[key]).map(([,label])=>label);
  $('remote-modes').textContent=modes.length?'Véletlen: '+modes.join(' · '):'Beállított labdasorozat';
}
$('show-remote').onclick=()=>showView('remote');
$('show-editor').onclick=$('remote-edit').onclick=()=>showView('editor');
$('remote-new').onclick=()=>$('new').click();
$('remote-drill').onchange=()=>{
  if(session){$('remote-drill').value=current.id;return;}
  if($('remote-drill').value.startsWith('preset:')){const code=$('remote-drill').value.slice(7);if(abandon())select(presetDrill(code,level,hand));else renderRemote();return;}
  const selected=drills.find(d=>d.id===$('remote-drill').value);
  if(!selected)return;
  if(!abandon()){$('remote-drill').value=current.id;return;}
  select(selected);
};

function select(d){current=validateDrill(copy(d));if(current.preset&&!PRESETS.some(p=>p.code===current.preset.code))delete current.preset;dirty=false;render();}
function meta(){
  const p=PRESETS.find(p=>p.code===current.preset?.code);
  $('exercise-title').textContent=p?p.english:'Saját gyakorlat';
  $('exercise-hu').textContent=p?p.hu:'Állítsd össze a saját labdasorozatodat.';
  $('incoming').textContent=current.random.type?'Beérkező labda: véletlen nyesett / üres / pörgetett':'Beérkező labda: '+incoming(current);
  $('preset-origin').hidden=!p;
}
function render(){
  if(current.preset){level=current.preset.level;hand=current.preset.hand;$('level').value=String(level);$('hand').value=hand;}
  for(const k of ['name','height','rounds','rest','mode','duration','order'])$(k).value=current[k];
  $('rounds').disabled=current.mode==='time';$('duration').disabled=current.mode!=='time';
  $('saved').textContent=dirty?'Nincs elmentve':drills.some(d=>d.id===current.id)?'Mentve':'Edzésminta';
  renderRandom();renderBalls();meta();library();catalog();controls();
}
function renderRandom(){
  for(const key of ['type','direction','height'])$('random-'+key).checked=current.random[key];
  for(const key of ['spin','min','max','heightMin','heightMax'])$('random-'+key).value=current.random[key];
  $('height').disabled=current.random.height;
  for(const key of ['heightMin','heightMax','height-around'])$('random-'+key).disabled=!current.random.height;
  $('random-spin').disabled=!current.random.type;
  for(const key of ['min','max','full'])$('random-'+key).disabled=!current.random.direction;
}
function preview(card,ball){
  const out=card.querySelector('.motor-preview');
  try{const [a,b]=wheels(ball,correction(ball.speed));out.textContent=`Felső kerék: ${a} · alsó: ${b} ford./perc`;}catch{out.textContent='Ellenőrizd a sebességet és a pörgetést.';}
}
function numberField(card,ball,key,label,min,max,step){
  const l=document.createElement('label');l.textContent=label;const input=document.createElement('input');Object.assign(input,{type:'number',min,max,step,value:ball[key]});input.dataset.key=key;
  input.oninput=()=>{ball[key]=input.value===''?NaN:Number(input.value);if(key==='speed'||key==='spin')delete ball.motor;changed();preview(card,ball);meta();};l.append(input);return l;
}
function renderBalls(){
  const old=Number($('test-ball').value)||0;$('balls').replaceChildren();$('test-ball').replaceChildren();
  current.balls.forEach((ball,index)=>{
    const card=document.createElement('div');card.className='ball';const head=document.createElement('div');head.className='ball-head';
    const title=document.createElement('span');title.className='ball-title';title.textContent=`${index+1}. LABDA`;
    const del=document.createElement('button');del.className='text-button';del.textContent='Eltávolítás';del.disabled=current.balls.length===1;
    del.onclick=()=>{current.balls.splice(index,1);changed();renderBalls();meta();};head.append(title,del);
    const fields=document.createElement('div');fields.className='ball-fields';const label=document.createElement('label');label.textContent='Beérkező labda';const type=document.createElement('select');type.dataset.key='type';
    for(const [v,t] of [['top','Pörgetett'],['back','Nyesett'],['none','Üres – pörgetés nélkül']])type.append(new Option(t,v));
    type.value=ball.type;type.onchange=()=>{ball.type=type.value;delete ball.motor;if(ball.type==='none')ball.spin=0;else if(ball.spin===0)ball.spin=1;changed();renderBalls();meta();};label.append(type);fields.append(label);
    fields.append(numberField(card,ball,'speed','Sebesség (0–10)',0,10,.5),numberField(card,ball,'spin','Pörgetés (0–10)',0,10,.5),numberField(card,ball,'drop','Oldalirány (−10…+10)',-10,10,.5),numberField(card,ball,'bpm','Labda / perc',30,90,1),numberField(card,ball,'reps','Egymás utáni labdák',1,20,1));
    type.disabled=current.random.type;
    fields.querySelector('[data-key="spin"]').disabled=current.random.type||ball.type==='none';
    fields.querySelector('[data-key="drop"]').disabled=current.random.direction;
    const output=document.createElement('p');output.className='motor-preview muted';card.append(head,fields,output);preview(card,ball);$('balls').append(card);
    $('test-ball').append(new Option(`${index+1}. labda`,index));
  });$('test-ball').value=String(Math.min(old,current.balls.length-1));$('add').disabled=current.balls.length>=5;
}
function draft(){
  const d=validateDrill(current);
  for(const b of d.balls){if(d.random.type){if(d.random.spin>limitedSpin(b))throw new Error('A véletlen pörgetés túl erős ehhez a sebességhez.');wheels({...b,type:'top',spin:d.random.spin,motor:undefined});}if(!d.random.type&&!b.motor&&b.type!=='none'&&b.spin>limitedSpin(b))throw new Error(`Ehhez a sebességhez legfeljebb ${limitedSpin(b)} pörgetést állíts be.`);wheels(b,correction(b.speed));}
  return d;
}
function save(asCopy=false){
  try{const d=draft();if(asCopy){d.id=crypto.randomUUID();d.name=(d.name+' – másolat').slice(0,100);}const next=drills.filter(x=>x.id!==d.id);next.push(d);if(next.length>300)throw new Error('Legfeljebb 300 gyakorlat tárolható.');persist(next);category='mine';select(d);message('Elmentve a Saját gyakorlataim közé.');}catch(e){message(e.message,true);}
}
for(const key of ['name','height','rounds','rest','mode','duration','order'])$(key).oninput=()=>{
  current[key]=['name','mode','order'].includes(key)?$(key).value:($(key).value===''?NaN:Number($(key).value));changed();
  if(key==='mode'){$('rounds').disabled=current.mode==='time';$('duration').disabled=current.mode!=='time';}
};
for(const key of ['type','direction','height'])$('random-'+key).onchange=()=>{current.random[key]=$('random-'+key).checked;changed();renderRandom();renderBalls();meta();};
for(const key of ['spin','min','max','heightMin','heightMax'])$('random-'+key).oninput=()=>{const input=$('random-'+key);current.random[key]=input.value===''?NaN:Number(input.value);changed();};
$('random-height-around').onclick=()=>{const h=current.height;if(!Number.isFinite(h)||h< -50||h>100){message('Előbb adj meg érvényes ívmagasságot (−50…100).',true);return;}current.random.heightMin=Math.max(-50,Math.round(h)-5);current.random.heightMax=Math.min(100,Math.round(h)+5);changed();renderRandom();};
$('random-full').onclick=()=>{current.random.min=-10;current.random.max=10;changed();renderRandom();};
$('new').onclick=()=>{if(abandon()){category='mine';select(newDrill());changed();showView('editor');}};
$('add').onclick=()=>{if(current.balls.length<5){current.balls.push(copy(current.balls.at(-1)));changed();renderBalls();meta();}};
$('save').onclick=()=>save();$('duplicate').onclick=()=>save(true);
$('delete').onclick=()=>{if(!confirm(`Törlöd ezt a gyakorlatot: ${current.name}?`))return;try{const next=drills.filter(x=>x.id!==current.id);if(!next.length)next.push(newDrill());persist(next);select(next[0]);}catch(e){message(e.message,true);}};
function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=()=>{try{const d=draft(),all=drills.filter(x=>x.id!==d.id);all.push(d);download(backup(all),'pongbot-hu-mentes.json');message('A saját gyakorlatok mentése elkészült.');}catch(e){message(e.message,true);}};
$('import').onclick=()=>$('file').click();
$('file').onchange=async()=>{
  const file=$('file').files[0];$('file').value='';if(!file)return;
  try{if(file.size>2000000)throw new Error('Legfeljebb 2 MB-os mentés tölthető be.');const incoming=readBackup(await file.text());if(!abandon())return;if(drills.length+incoming.length>300)throw new Error('A betöltés túllépné a 300 gyakorlatot.');persist([...drills,...incoming.map(x=>({...x,id:crypto.randomUUID()}))]);category='mine';select(drills.at(-1));message(`${incoming.length} gyakorlat betöltve. A meglévők megmaradtak.`);}catch(e){message(e.message,true);}
};
for(const [id,hu,en] of [...CATEGORIES,['mine','Saját','Mentéseim']]){
  const b=document.createElement('button');b.dataset.category=id;b.className='category';b.textContent=hu;const span=document.createElement('span');span.textContent=en;b.append(span);
  b.onclick=()=>{category=id;catalog();};$('categories').append(b);
}
$('search').oninput=catalog;
for(const id of ['level','hand'])$(id).onchange=()=>{
  if(current.preset&&!abandon()){$('level').value=String(level);$('hand').value=hand;return;}
  level=Number($('level').value);hand=$('hand').value;if(current.preset)select(presetDrill(current.preset.code,level,hand));
};
function calValues(){return {speed:Number($('cal-speed').value),trim:Number($('cal-trim').value),height:Number($('cal-height').value)};}
function calPreview(){const {speed,trim}=calValues();$('cal-value').textContent=`${trim>0?'+':''}${trim} ford./perc`;try{const [a,b]=wheels({type:'none',speed,spin:0},trim);$('cal-wheels').textContent=`Felső: ${a} · alsó: ${b} ford./perc`;}catch{$('cal-wheels').textContent='Érvénytelen korrekció.';}}
$('cal-speed').oninput=()=>{$('cal-trim').value=String(correction(Number($('cal-speed').value)));calPreview();};$('cal-trim').oninput=calPreview;
$('cal-save').onclick=()=>{try{const {speed,trim}=calValues();wheels({type:'none',speed,spin:0},trim);const next=validateCalibration({...profile,[String(speed)]:trim});localStorage.setItem(CALIBRATION_STORE,JSON.stringify(next));profile=next;renderBalls();message('Az üres labda kerékegyensúlya elmentve ehhez a sebességhez.');}catch(e){message(e.message,true);}};
$('cal-reset').onclick=()=>{try{localStorage.setItem(CALIBRATION_STORE,'{}');profile={};$('cal-trim').value=0;calPreview();renderBalls();message('Az üres labda korrekciója alaphelyzetbe állítva.');}catch(e){message(e.message,true);}};
$('cal-test').onclick=()=>{try{const {speed,trim,height}=calValues();start(true,calibrationDrill(speed,trim,height));}catch(e){message(e.message,true);}};
function controls(){
  const active=!!session;for(const id of ['show-editor','remote-edit','remote-new'])$(id).disabled=active;renderRemote();$('editor').disabled=active;$('calibration-settings').disabled=active;
  for(const id of ['new','import','export','level','hand'])$(id).disabled=active;
  $('level').disabled=active||!current.preset;$('hand').disabled=active||!current.preset;
  $('delete').disabled=!drills.some(d=>d.id===current.id);
  $('connect').disabled=active;$('connect').textContent=robot.ready?'Kapcsolat bontása':'Kapcsolódás';
  $('test').disabled=!robot.ready||active;$('start').disabled=!robot.ready||active;$('cal-test').disabled=!robot.ready||active;$('test-ball').disabled=active;
  $('stop').disabled=!robot.ready&&!active;$('pause').disabled=!session?.started;$('pause').hidden=!active;
  $('pause').textContent=session?.paused?'Folytatás':session?.pauseRequested?'Szünet következik…':'Szünet a sorozat végén';
  document.querySelector('.run-panel').classList.toggle('active',active);document.body.classList.toggle('running',active);library();catalog();
}
$('connect').onclick=async()=>{
  if(robot.ready){robot.disconnect();return;}$('connect').disabled=true;$('connection').textContent='Kapcsolódás…';
  try{await robot.connect();message('Kapcsolódva. Először az 1 labdás próbával ellenőrizd a beállítást.');}
  catch(e){message(e.name==='NotFoundError'?'Nem választottál robotot.':e.message,true);$('connection').textContent='Nincs kapcsolat';}finally{controls();}
};
robot.addEventListener('connected',e=>{$('connection').textContent=e.detail;$('dot').classList.add('on');controls();});
robot.addEventListener('disconnected',()=>{const active=!!session;reset();$('connection').textContent='Nincs kapcsolat';$('dot').classList.remove('on');message(active?'Megszakadt a kapcsolat. Ha a robot még adogat, kapcsold ki.':'A kapcsolat bontva.',active);});
robot.addEventListener('error',e=>message(e.detail,true));
function clearSessionTimers(s){for(const k of ['timer','watchdog','endTimer','ticker']){clearTimeout(s?.[k]);clearInterval(s?.[k]);}}
function reset(){epoch++;clearSessionTimers(session);session=null;wake?.release().catch(()=>{});wake=null;$('run-status').textContent='Készen állsz?';$('run-detail').textContent='Indítás 5 másodperces visszaszámlálással.';controls();}
async function stop(text='Leállítva.'){
  reset();try{const sent=await robot.stop();message(sent?text:'Nincs kapcsolat: leállítási parancs nem küldhető.',!sent);}catch(e){message('Nem sikerült elküldeni a leállítást. Ha a robot adogat, kapcsold ki. '+e.message,true);robot.disconnect();}
}
$('stop').onclick=()=>stop();
function timeLabel(ms){const sec=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
function armClock(s){
  if(s.d.mode!=='time')return;
  s.endAt=Date.now()+s.remaining;s.endTimer=setTimeout(()=>{if(session===s)stop('Az edzésidő letelt.');},s.remaining);
  s.ticker=setInterval(()=>{if(session===s&&!s.paused)$('run-status').textContent=timeLabel(s.endAt-Date.now())+' hátra';},500);
}
async function start(single=false,override=null){
  if(session||!robot.ready)return;
  try{
    let d=override||draft();if(single){const i=override?0:Number($('test-ball').value);d={...d,mode:'rounds',rounds:1,balls:[{...d.balls[i],reps:1}],rest:0};}
    for(const b of d.balls)wheels(b,d.neutralOverride??correction(b.speed));
    const token=++epoch;session={d,token,completed:0,pending:false,started:false,remaining:d.duration*1000,batches:[],batchIndex:0};showView('remote');controls();
    if(navigator.wakeLock)navigator.wakeLock.request('screen').then(lock=>{if(session?.token===token)wake=lock;else lock.release();}).catch(()=>{});
    let seconds=5;const tick=()=>{const s=session;if(s?.token!==token)return;if(seconds===0){s.started=true;armClock(s);controls();runRound();return;}$('run-status').textContent=`Indulás ${seconds}…`;$('run-detail').textContent=single?'Egyetlen próbalabda.':d.name;seconds--;s.timer=setTimeout(tick,1000);};tick();
  }catch(e){message(e.message,true);}
}
async function runRound(){
  const s=session;if(!s||s.pending||s.paused)return;
  const d=s.d.order==='random'?{...s.d,balls:s.d.balls.map(()=>copy(s.d.balls[Math.floor(Math.random()*s.d.balls.length)]))}:s.d;
  s.batches=roundBatches(d);s.batchIndex=0;await runBatch();
}
async function runBatch(){
  const s=session;if(!s||s.pending||s.paused)return;s.pending=true;
  const d=s.batches[s.batchIndex];
  $('run-status').textContent=s.d.mode==='time'?timeLabel(s.endAt-Date.now())+' hátra':`${s.completed+1}. kör / ${s.d.rounds}`;$('run-detail').textContent=s.d.name;
  const expected=d.balls.reduce((sum,b)=>sum+b.reps*60000/b.bpm,0);
  s.watchdog=setTimeout(()=>{if(session===s)stop('A robot nem jelzett vissza időben. Az edzés leállítva.');},expected+20000);
  try{await robot.run(d,correction);}catch(e){if(session===s)await stop('Leállítva: '+e.message);}
}
function pauseNow(s){s.paused=true;s.pauseRequested=false;s.pending=false;clearSessionTimers(s);if(s.d.mode==='time')s.remaining=Math.max(0,s.endAt-Date.now());$('run-status').textContent='Szünet';$('run-detail').textContent='A Folytatás gombbal indul a következő sorozat.';controls();}
$('pause').onclick=()=>{
  const s=session;if(!s?.started)return;
  if(s.paused){s.paused=false;armClock(s);controls();runRound();}
  else if(s.pending){s.pauseRequested=true;controls();}
  else pauseNow(s);
};
robot.addEventListener('done',()=>{
  const s=session;if(!s?.pending||s.paused)return;s.pending=false;clearTimeout(s.watchdog);s.batchIndex++;
  if(s.batchIndex<s.batches.length){s.timer=setTimeout(()=>{if(session===s)runBatch();},0);return;}
  s.completed++;
  if(s.d.mode==='rounds'&&s.completed>=s.d.rounds){stop('A gyakorlat befejeződött.');return;}
  if(s.pauseRequested){pauseNow(s);return;}
  if(s.d.rest>0){$('run-status').textContent='Körök közti szünet';$('run-detail').textContent=`${s.completed} kör kész · ${s.d.rest} másodperc pihenő`;}
  s.timer=setTimeout(()=>{if(session===s)runRound();},s.d.rest*1000);
});
$('start').onclick=()=>start();$('test').onclick=()=>start(true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&session)stop('A lap háttérbe került, az edzés leállítva.');});
window.addEventListener('pagehide',()=>{if(session)stop();});
window.addEventListener('beforeunload',e=>{if(dirty||session){e.preventDefault();e.returnValue='';}});
select(presetDrill('push(b)'));showView('remote');$('cal-trim').value=String(correction(Number($('cal-speed').value)));calPreview();
if(!window.isSecureContext||!navigator.bluetooth)message('A szerkesztés működik. Robotvezérléshez Androidon Chrome-ban, HTTPS webcímen nyisd meg.');
