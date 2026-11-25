import {parseArgs} from 'node:util';
import {runWorld,report,LIMITS} from './world.mjs';
const help=`VÉRTICE — laboratório multiagente autônomo\n\nnode src/cli.mjs [--seed 2189] [--bots 36] [--ticks 500] [--every 50] [--scenario paradox|balance] [--json]\n--bots: ${LIMITS.minBots}–${LIMITS.maxBots}; --ticks: 0–${LIMITS.maxTicks}; --every: intervalo dos relatórios.\nNenhum acesso a rede, dispositivos ou pessoas. Ctrl+C interrompe a execução.\n`;
try{
 const {values}=parseArgs({options:{seed:{type:'string',default:'2189'},bots:{type:'string',default:'36'},ticks:{type:'string',default:'500'},every:{type:'string',default:'50'},scenario:{type:'string',default:'paradox'},json:{type:'boolean',default:false},help:{type:'boolean',short:'h'}}});
 if(values.help){console.log(help);process.exitCode=0;}else{
 const integer=(s)=>{if(!/^\d+$/.test(s))throw new Error('Informe inteiros não negativos.');const n=Number(s);if(!Number.isSafeInteger(n))throw new Error('Valor fora do intervalo.');return n;};
 const seed=integer(values.seed),bots=integer(values.bots),ticks=integer(values.ticks),every=integer(values.every);if(every<1)throw new Error('--every precisa ser maior que zero.');
 const w=runWorld({seed,bots,ticks,scenario:values.scenario,onStep:r=>{if(!values.json&&r.tick%every===0)console.log(`Ciclo ${String(r.tick).padStart(5,'0')} | ${r.policy.padEnd(10)} | energia ${r.energy.toFixed(1)} | estabilidade ${r.stability.toFixed(1)} | pluralidade ${r.plurality.toFixed(1)}`);}});
 console.log(JSON.stringify(values.json?w:report(w),null,2));}
}catch(error){console.error(`Erro: ${error.message}\n${help}`);process.exitCode=1;}
