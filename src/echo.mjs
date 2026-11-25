// ECHO is a numerical visualization of a fictional disturbance.
// A fixed array of scalar values, not programs, hosts, addresses or executable payloads.
import {runWorld} from './world.mjs';
const WIDTH = 12, HEIGHT = 10, SIZE = WIDTH * HEIGHT;
const clamp = n => Math.max(0, Math.min(1, n));
const average = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
const round = n => Math.round(n*10000)/10000;
export const FIELD_SIZE = Object.freeze({width:WIDTH,height:HEIGHT});

export function initialField(){
  return Array.from({length:SIZE},(_,i)=>i===Math.floor(HEIGHT/2)*WIDTH+Math.floor(WIDTH/2)?1:0);
}

// A discrete, dissipative heat field on a fixed mathematical rectangle.
// Reflecting boundaries: no external destinations or agent-to-agent messages.
export function advanceField(field, input){
  if(!Array.isArray(field)||field.length!==SIZE||field.some(v=>!Number.isFinite(v)||v<0||v>1)||!Number.isFinite(input)||input<0||input>1)throw new RangeError('Campo numérico inválido.');
  return field.map((value,i)=>{
    const x=i%WIDTH,y=Math.floor(i/WIDTH);
    const neighbors=[x>0?field[i-1]:value,x<WIDTH-1?field[i+1]:value,y>0?field[i-WIDTH]:value,y<HEIGHT-1?field[i+WIDTH]:value];
    const source=i===Math.floor(HEIGHT/2)*WIDTH+Math.floor(WIDTH/2)?input*.12:0;
    return clamp(value*.63+average(neighbors)*.34+source);
  });
}

export function summarize(field){
  if(!Array.isArray(field)||field.length!==SIZE||field.some(v=>!Number.isFinite(v)||v<0||v>1))throw new RangeError('Campo numérico inválido.');
  return {mean:round(average(field)),peak:round(Math.max(...field)),nonzero:field.filter(x=>x>.001).length};
}

export function renderField(field){
  summarize(field);
  const palette=' .:-=+*#%@';
  return Array.from({length:HEIGHT},(_,y)=>field.slice(y*WIDTH,(y+1)*WIDTH).map(v=>palette[Math.min(palette.length-1,Math.floor(Math.sqrt(v)*(palette.length-1)))]).join('')).join('\n');
}

export function runEcho({seed=2189,bots=36,ticks=250,scenario='paradox',onFrame}={}){
  if(onFrame!==undefined&&typeof onFrame!=='function')throw new TypeError('onFrame deve ser função.');
  let field=initialField(), firstContradiction=null;
  const frames=[];
  const world=runWorld({seed,bots,ticks,scenario,onStep:r=>{
    // Read-only observer. The field never changes decisions or world state.
    const input=clamp(Math.abs(r.stability-r.plurality)/100);
    field=advanceField(field,input);
    if(r.contradiction)firstContradiction??=r.tick;
    const frame={tick:r.tick,stability:r.stability,plurality:r.plurality,contradiction:r.contradiction,...summarize(field)};
    frames.push(frame);
    onFrame?.({...frame},[...field]);
  }});
  return {schema:1,kind:'fictional-scalar-field',seed,bots,ticks,scenario,dimensions:FIELD_SIZE,firstContradiction,field:field.map(round),summary:summarize(field),frames,worldTick:world.tick};
}
