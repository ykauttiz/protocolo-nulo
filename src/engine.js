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
export function validateStory(chapters=CHAPTERS, endings=ENDINGS){const ids=new Set();for(const ch of chapters){if(typeof ch.id!=='string'||!ch.id||ids.has(ch.id)||!Array.isArray(ch.choices)||ch.choices.length<2)throw new Error('Capítulo inválido');ids.add(ch.id);const choices=new Set();for(const c of ch.choices){if(typeof c.id!=='string'||!c.id||choices.has(c.id))throw new Error('Decisão duplicada');choices.add(c.id);for(const [k,v] of Object.entries(c.effects))if(!Object.hasOwn(METRICS,k)||!Number.isInteger(v))throw new Error('Efeito inválido');for(const [k,v] of Object.entries(c.relation))if(!Object.hasOwn(PEOPLE,k)||!Number.isInteger(v))throw new Error('Relação inválida');if(c.requires&&(!Object.hasOwn(METRICS,c.requires.metric)||!Number.isInteger(c.requires.min)||c.requires.min<0||c.requires.min>100))throw new Error('Requisito inválido');}if(!ch.choices.some(c=>!c.requires))throw new Error('Sem decisão livre');}if(!chapters.length)throw new Error('Campanha vazia');for(const id of ['charter','hybrid','fragile','archive','continuity','dialogue'])if(!Object.hasOwn(endings,id)||!endings[id].title||!endings[id].text)throw new Error('Desfecho inválido');return true;}

// Rebuild the previous turn instead of modifying accumulated metrics.
export function undo(state){return state.history.slice(0,-1).map(x=>x.choice).reduce(choose,initial());}
export function councilFeedback(state){const messages={lia:['Lia considera que o arquivo precisa de mais atenção.','Lia reconhece seu compromisso com os registros.'],nilo:['Nilo pede mais espaço para a participação civil.','Nilo reconhece sua abertura ao diálogo.'],iris:['Íris alerta para decisões que ainda exigem revisão.','Íris reconhece sua atenção à supervisão técnica.']};return Object.entries(state.relations).filter(([,v])=>Math.abs(v)>=2).map(([id,v])=>messages[id][v>0?1:0]);}
