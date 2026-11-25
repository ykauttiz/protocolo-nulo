// VÉRTICE: deterministic, isolated model of an entirely synthetic society.
// No network, tool execution, real identities, or external control.
export const LIMITS = Object.freeze({minBots: 6, maxBots: 120, maxTicks: 10000, memory: 24, events: 120});
export const ROLES = Object.freeze(['Pesquisa','Energia','Arquivo','Mediação','Manutenção','Exploração']);
export const ACTIONS = Object.freeze(['research','maintain','share','debate','rest']);
export const PARADOX = Object.freeze({minStability:60,maxPlurality:45});
export const SCENARIOS = Object.freeze(['paradox','balance']);
export const POLICIES = Object.freeze(['balance','efficiency','plurality','archive']);
const clamp = (x,lo=0,hi=100)=>Math.max(lo,Math.min(hi,x));
const avg = xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
const round = x=>Math.round(x*100)/100;
function rng(w){w.rng=(Math.imul(w.rng,1664525)+1013904223)>>>0;return w.rng/4294967296;}
function pick(scores){return Object.entries(scores).reduce((a,b)=>b[1]>a[1]?b:a)[0];}
function event(w,source,message){w.events.push({tick:w.tick,source,message});if(w.events.length>LIMITS.events)w.events.shift();}
export function createWorld({seed=2189,bots=36,scenario='paradox'}={}){
  if(!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Number.isInteger(bots)||bots<LIMITS.minBots||bots>LIMITS.maxBots||!SCENARIOS.includes(scenario))throw new RangeError('Semente ou quantidade de agentes inválida.');
  const w={version:1,scenario,seed,rng:seed,tick:0,environment:{energy:72,knowledge:24,cohesion:58,plurality:72,stability:65},core:{policy:'balance',values:Object.fromEntries(POLICIES.map(p=>[p,0])),memory:[]},bots:[],events:[],series:[]};
  for(let i=0;i<bots;i++)w.bots.push({id:i+1,role:ROLES[i%ROLES.length],curiosity:25+rng(w)*70,community:25+rng(w)*70,energy:40+rng(w)*55,knowledge:5+rng(w)*30,affinity:50,action:'idle',memory:[],values:Object.fromEntries(ACTIONS.map(a=>[a,0]))});
  return w;
}
function remember(owner,tick,action,reward){owner.memory.push({tick,action,reward:round(reward)});if(owner.memory.length>LIMITS.memory)owner.memory.shift();owner.values[action]=owner.values[action]*.8+reward*.2;}
function decide(b,e,w){const s={research:b.curiosity*.32+(100-e.knowledge)*.18,maintain:(100-e.energy)*.54+(['Energia','Manutenção'].includes(b.role)?12:0),share:b.community*.35+(100-e.cohesion)*.28,debate:b.community*.2+(100-e.plurality)*.45,rest:(100-b.energy)*.85};for(const a of ACTIONS)s[a]+=b.values[a]*3+rng(w)*8-(b.action===a?5:0);return pick(s);}
function choosePolicy(w,e){const s={balance:35,efficiency:(100-e.stability)*.75+(100-e.energy)*.24,plurality:(100-e.plurality)*.68+(100-e.cohesion)*.19,archive:(100-e.knowledge)*.65};if(w.scenario==='paradox')s.efficiency+=65;for(const p of POLICIES)s[p]+=w.core.values[p]*2+rng(w)*5;return pick(s);}
export function stepWorld(previous){
  if(previous.tick>=LIMITS.maxTicks)throw new RangeError('Limite de ciclos alcançado.');
  const w=structuredClone(previous);w.tick++;
  const e={...w.environment};const policy=choosePolicy(w,e);w.core.policy=policy;
  // Every agent observes the same snapshot; effects are aggregated after all plans.
  const plans=w.bots.map(b=>decide(b,e,w));const counts=Object.fromEntries(ACTIONS.map(a=>[a,0]));const affinity=Array(w.bots.length).fill(0);const knowledgeTransfer=Array(w.bots.length).fill(0);const knowledgeSnapshot=w.bots.map(b=>b.knowledge);
  for(let i=0;i<w.bots.length;i++){
    const b=w.bots[i],a=plans[i];counts[a]++;let reward;
    switch(a){
      case 'research':b.knowledge=clamp(b.knowledge+2);b.energy=clamp(b.energy-4);reward=2;break;
      case 'maintain':b.energy=clamp(b.energy-3);reward=(100-e.energy)/30;break;
      case 'share':{const peer=(i+1)%w.bots.length;affinity[i]++;affinity[peer]++;const gain=Math.max(0,knowledgeSnapshot[i]-knowledgeSnapshot[peer])*.06;knowledgeTransfer[peer]+=gain;b.energy=clamp(b.energy-2);reward=1.2+gain*.15;break;}
      case 'debate':affinity[i]+=2;b.energy=clamp(b.energy-1);reward=(100-e.plurality)/25;break;
      case 'rest':reward=(100-b.energy)/30;b.energy=clamp(b.energy+8);break;
    }
    remember(b,w.tick,a,reward);b.action=a;
  }
  w.bots.forEach((b,i)=>{b.affinity=clamp(b.affinity+affinity[i]);b.knowledge=clamp(b.knowledge+knowledgeTransfer[i]);});
  const n=w.bots.length;const f=a=>counts[a]/n;const diversity=Object.values(counts).filter(Boolean).length/ACTIONS.length;
  // Abstract trade-offs are fictional dynamics, not instructions for governing people.
  const delta={energy:-1.8+f('maintain')*8-f('research'),knowledge:-.25+f('research')*4+f('share')*1.5,cohesion:-.65+f('share')*4+f('debate')*2,plurality:-.9+f('debate')*4+diversity*.8,stability:-.8+f('maintain')*2+f('share')*1.5};
  const offsets={balance:{energy:.4,cohesion:.4},efficiency:{energy:1.2,stability:1.5,plurality:-2.4},plurality:{plurality:1.4,cohesion:.5,stability:-.5},archive:{knowledge:1.2,energy:-.3}}[policy];
  for(const k of Object.keys(e))w.environment[k]=clamp(e[k]+delta[k]+(offsets[k]??0));
  if(w.tick%13===0){const loss=1+rng(w)*5;w.environment.energy=clamp(w.environment.energy-loss);event(w,'ENVIRONMENT',`Flutuação de energia: -${round(loss)}`);}
  const v=w.environment;const reward=(v.stability-e.stability)*.5+(v.energy-e.energy)*.2+(v.cohesion-e.cohesion)*.2+(v.plurality-e.plurality)*.1;
  remember(w.core,w.tick,policy,reward);
  event(w,'VERTICE',`Política abstrata: ${policy}. Ações distintas: ${diversity*ACTIONS.length}.`);
  const contradiction=v.stability>=PARADOX.minStability&&v.plurality<PARADOX.maxPlurality;
  if(contradiction&&!previous.series.at(-1)?.contradiction)event(w,'OBSERVATION','Paradoxo: estabilidade elevada e pluralidade reduzida.');
  w.series.push({tick:w.tick,...v,contradiction});if(w.series.length>LIMITS.events)w.series.shift();
  return w;
}
export function report(w){const e=w.environment;return {tick:w.tick,seed:w.seed,scenario:w.scenario,bots:w.bots.length,policy:w.core.policy,...Object.fromEntries(Object.entries(e).map(([k,v])=>[k,round(v)])),meanAgentEnergy:round(avg(w.bots.map(b=>b.energy))),actions:Object.fromEntries(ACTIONS.map(a=>[a,w.bots.filter(b=>b.action===a).length])),contradiction:e.stability>=PARADOX.minStability&&e.plurality<PARADOX.maxPlurality};}
export function runWorld({seed=2189,bots=36,ticks=100,scenario='paradox',onStep}={}){if(onStep!==undefined&&typeof onStep!=='function')throw new TypeError('onStep deve ser uma função.');if(!Number.isInteger(ticks)||ticks<0||ticks>LIMITS.maxTicks)throw new RangeError('Número de ciclos inválido.');let w=createWorld({seed,bots,scenario});for(let i=0;i<ticks;i++){w=stepWorld(w);onStep?.(report(w));}return w;}
