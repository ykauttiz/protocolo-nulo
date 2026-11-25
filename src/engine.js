import {CHAPTERS, METRICS, PEOPLE, ENDINGS} from './story.js';
export const VERSION=1;
const clamp=(n,lo=0,hi=100)=>Math.max(lo,Math.min(hi,n));
export function initial(){return {version:VERSION,turn:0,metrics:{liberty:45,stability:65,trust:45,evidence:15},relations:{lia:0,nilo:0,iris:0},flags:[],history:[]};}
export function available(state,choice){return !choice.requires || state.metrics[choice.requires.metric]>=choice.requires.min;}
export function choose(state,id){
 const chapter=CHAPTERS[state.turn];if(!chapter)throw new Error('Campanha concluída.');
 const choice=chapter.choices.find(x=>x.id===id);if(!choice||!available(state,choice))throw new Error('Decisão indisponível.');
 const metrics={...state.metrics},relations={...state.relations};
 for(const [k,v] of Object.entries(choice.effects))metrics[k]=clamp(metrics[k]+v);
 for(const [k,v] of Object.entries(choice.relation))relations[k]=clamp(relations[k]+v,-5,10);
 return {...state,turn:state.turn+1,metrics,relations,flags:choice.flag?[...state.flags,choice.flag]:[...state.flags],history:[...state.history,{chapter:chapter.id,choice:id,label:choice.label,metrics:{...metrics}}]};
}
export function ending(state){if(state.turn!==CHAPTERS.length)return null;const {liberty:l,stability:s,trust:t,evidence:e}=state.metrics;const f=new Set(state.flags);let id;
 if(f.has('charter')&&l>=75&&t>=65&&e>=55&&s>=20)id='charter';
 else if(f.has('hybrid')&&l>=60&&s>=45&&t>=55)id='hybrid';
 else if((f.has('charter')||f.has('hybrid'))&&l>=60&&t>=40)id='fragile';
 else if(e>=65&&f.has('archive'))id='archive';
 else if(f.has('continuity')||l<=30)id='continuity';else id='dialogue';return {id,...ENDINGS[id]};}
// Only the choices are persisted; rederive all state from canonical content.
export function serialize(state){return JSON.stringify({version:VERSION,choices:state.history.map(x=>x.choice)});}
export function restore(raw){if(typeof raw!=='string'||raw.length>2000)throw new Error('Arquivo inválido.');const v=JSON.parse(raw);if(v?.version!==VERSION||!Array.isArray(v.choices)||v.choices.length>CHAPTERS.length||!v.choices.every(x=>typeof x==='string'))throw new Error('Formato incompatível.');return v.choices.reduce(choose,initial());}
export function validateStory(){const ids=new Set();for(const ch of CHAPTERS){if(ids.has(ch.id)||ch.choices.length<2)throw new Error('Capítulo inválido');ids.add(ch.id);const choices=new Set();for(const c of ch.choices){if(choices.has(c.id))throw new Error('Decisão duplicada');choices.add(c.id);for(const [k,v] of Object.entries(c.effects))if(!(k in METRICS)||!Number.isInteger(v))throw new Error('Efeito inválido');for(const [k,v] of Object.entries(c.relation))if(!(k in PEOPLE)||!Number.isInteger(v))throw new Error('Relação inválida');if(c.requires&&(!(c.requires.metric in METRICS)||!Number.isFinite(c.requires.min)))throw new Error('Requisito inválido');}if(!ch.choices.some(c=>!c.requires))throw new Error('Sem decisão livre');}return true;}
