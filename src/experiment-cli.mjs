import {parseArgs} from 'node:util';
import {compareScenarios,EXPERIMENT_LIMITS} from './experiment.mjs';
const help='VÉRTICE | Experimento pareado\nnode src/experiment-cli.mjs [--seed 2189] [--bots 36] [--ticks 250] [--replicates 8]\nSaída JSON. Limite de '+EXPERIMENT_LIMITS.agentCycles+' agente-ciclos.\n';
try{
 const {values}=parseArgs({options:{seed:{type:'string',default:'2189'},bots:{type:'string',default:'36'},ticks:{type:'string',default:'250'},replicates:{type:'string',default:'8'},help:{type:'boolean',short:'h'}}});
 if(values.help)console.log(help);else{
  const integer=s=>{if(!/^\d+$/.test(s)||!Number.isSafeInteger(Number(s)))throw new RangeError('Use inteiros não negativos.');return Number(s);};
  const p=Object.fromEntries(['seed','bots','ticks','replicates'].map(k=>[k,integer(values[k])]));
  console.log(JSON.stringify(compareScenarios(p),null,2));
 }
}catch(e){console.error('Erro: '+e.message+'\n'+help);process.exitCode=1;}
