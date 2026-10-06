import {SERVICE,WRITE,NOTIFY,ADVERTISED,STOP,handshakeReply,containsDone,drillPacket} from './protocol.js?v=0.3';
export class Robot extends EventTarget {
  constructor(){super();this.ready=false;this.queue=Promise.resolve();this.generation=0;this.phase='off';}
  signal(type,detail){this.dispatchEvent(new CustomEvent(type,{detail}));}
  async connect(){
    if(!navigator.bluetooth) throw new Error('Ehhez Androidon Chrome és HTTPS webcím szükséges.');
    if(this.device?.gatt.connected) throw new Error('Már van kapcsolat.');
    this.device=await navigator.bluetooth.requestDevice({filters:[{services:[ADVERTISED]}],optionalServices:[SERVICE]});
    this.device.addEventListener('gattserverdisconnected',()=>this.lost());
    try {
      const server=await this.device.gatt.connect(), service=await server.getPrimaryService(SERVICE);
      this.writer=await service.getCharacteristic(WRITE);
      const reader=await service.getCharacteristic(NOTIFY);
      await reader.startNotifications();
      reader.addEventListener('characteristicvaluechanged',e=>{
        const d=e.target.value;const bytes=new Uint8Array(d.buffer,d.byteOffset,d.byteLength).slice();
        this.receive(bytes).catch(error=>{this.signal('error',error.message);this.disconnect();});
      });
      this.phase='challenge';this.ready=false;this.queue=Promise.resolve();
      const connected=new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});
      this.timer=setTimeout(()=>{this.reject?.(new Error('A robot nem válaszolt időben. Próbáld újra a kapcsolódást.'));this.disconnect();},12000);
      await this.write(new Uint8Array([7,0,0,0]));
      await connected;
    } catch(error){this.disconnect();throw error;}
  }
  async receive(bytes){
    if(this.phase==='challenge') {this.phase='ack1';await this.write(handshakeReply(bytes));}
    else if(this.phase==='ack1') {this.phase='ack2';await this.write(new Uint8Array([1,0,0]));}
    else if(this.phase==='ack2') {this.phase='ack3';await this.write(new Uint8Array([2,0,0]));}
    else if(this.phase==='ack3') {
      this.phase='initializing';await this.write(new Uint8Array([128,1,0,0]));
      if(!this.device?.gatt.connected)return;
      this.phase='ready';this.ready=true;clearTimeout(this.timer);this.resolve?.();this.resolve=null;this.reject=null;this.signal('connected',this.device.name||'Nova S Pro');
    } else if(this.phase==='ready' && containsDone(bytes))this.signal('done');
  }
  write(bytes, generation=this.generation){
    const work=this.queue.catch(()=>{}).then(async()=>{
      if(generation!==this.generation)return false;
      if(!this.writer || !this.device?.gatt.connected)throw new Error('Megszakadt a Bluetooth-kapcsolat.');
      await this.writer.writeValue(bytes);return true;
    });
    this.queue=work;return work;
  }
  run(drill){if(!this.ready)return Promise.reject(new Error('Előbb kapcsolódj a robothoz.'));return this.write(drillPacket(drill));}
  stop(){this.generation++;if(!this.device?.gatt.connected)return Promise.resolve(false);return this.write(STOP);}
  disconnect(){clearTimeout(this.timer);this.device?.gatt.disconnect();this.lost();}
  lost(){
    const active=this.phase!=='off';this.generation++;this.ready=false;this.phase='off';this.writer=null;clearTimeout(this.timer);
    this.reject?.(new Error('A kapcsolódás megszakadt.'));this.reject=null;this.resolve=null;
    if(active)this.signal('disconnected');
  }
}
