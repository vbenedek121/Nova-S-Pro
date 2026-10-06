// Independently implemented from the Nova S Pro wire format observed in
// https://github.com/olanga/nova . No upstream application code is bundled.
export const SERVICE='02f00000-0000-0000-0000-00000000fe00';
export const NOTIFY='02f00000-0000-0000-0000-00000000ff02';
export const WRITE='02f00000-0000-0000-0000-00000000ff01';
export const ADVERTISED=0xfeff;
export const STOP=new Uint8Array([128,1,0,1]);
export const DONE=new Uint8Array([0,2,3,0,5,1,0]);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
// RFC 1321 MD5, required by the device's pairing exchange (not password storage).
export function md5(text) {
  const bytes=new TextEncoder().encode(text), length=Math.ceil((bytes.length+9)/64)*64;
  const block=new Uint8Array(length); block.set(bytes); block[bytes.length]=128;
  const v=new DataView(block.buffer); v.setUint32(length-8,bytes.length*8,true); v.setUint32(length-4,Math.floor(bytes.length/536870912),true);
  let h=[0x67452301,0xefcdab89,0x98badcfe,0x10325476];
  const shifts=[[7,12,17,22],[5,9,14,20],[4,11,16,23],[6,10,15,21]];
  for (let offset=0;offset<length;offset+=64) {
    let [a,b,c,d]=h;
    for(let i=0;i<64;i++) {
      const group=Math.floor(i/16);
      const f=group===0 ? (b&c)|(~b&d) : group===1 ? (d&b)|(~d&c) : group===2 ? b^c^d : c^(b|~d);
      const index=group===0?i:group===1?(5*i+1)%16:group===2?(3*i+5)%16:(7*i)%16;
      const k=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;
      const sum=(a+f+k+v.getUint32(offset+index*4,true))|0, s=shifts[group][i%4];
      const next=(b+((sum<<s)|(sum>>>(32-s))))|0;
      a=d;d=c;c=b;b=next;
    }
    h=h.map((x,i)=>(x+[a,b,c,d][i])>>>0);
  }
  const out=new Uint8Array(16), ov=new DataView(out.buffer); h.forEach((x,i)=>ov.setUint32(i*4,x,true));
  return [...out].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export function handshakeReply(data) {
  const text=new TextDecoder().decode(data);
  if(text.length<=18) throw new Error('Hiányos robotazonosító.');
  const serial=text.slice(6,18), salt='Mjgx1jAwXDBaMFcxCz3JBgNVBAYT4kJF7Rkw';
  let input=serial;
  for(const letter of serial) input+=salt[letter.charCodeAt(0)%36];
  const digest=new TextEncoder().encode(md5(input+text.slice(18)));
  const reply=new Uint8Array(35); reply.set([8,32,0]);reply.set(digest,3);return reply;
}
export function wheels(ball) {
  const base=970+630.5*ball.speed, delta=ball.type==='none'?0:342*ball.spin*(ball.type==='back'?-1:1);
  return [Math.round(clamp(base+delta,400,7500)),Math.round(clamp(base-delta,400,7500))];
}
export function limitedSpin(ball) {
  const base=970+630.5*ball.speed;
  return Math.max(0,Math.floor(Math.min(base-400,7500-base)/342*2)/2);
}
export function drillPacket(drill) {
  const buffer=new ArrayBuffer(7+24*drill.balls.length), v=new DataView(buffer);
  v.setUint8(0,129);v.setUint16(1,4+24*drill.balls.length,true);v.setUint8(3,1);v.setUint16(4,1,true);
  drill.balls.forEach((ball,i)=>{
    const p=7+i*24,[upper,lower]=wheels(ball);
    v.setUint32(p,upper,true);v.setUint32(p+4,lower,true);
    v.setFloat32(p+8,((ball.height??drill.height)+50)/3-20,true);
    v.setFloat32(p+12,ball.drop*2.2,true);
    v.setFloat32(p+16,ball.bpm/60,true);v.setUint32(p+20,ball.reps,true);
  });
  return new Uint8Array(buffer);
}
export function containsDone(bytes) {
  return bytes.some((_,i)=>i+DONE.length<=bytes.length && DONE.every((b,j)=>bytes[i+j]===b));
}
