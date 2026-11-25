import {parseArgs} from 'node:util';
import {runEcho,renderField} from './echo.mjs';
const help='VÉRTICE / ECHO — visualização matemática de uma anomalia fictícia\n--seed 2189 --bots 36 --ticks 250 --scenario paradox|balance --every 50 --json\n';
try{
  const {values}=parseArgs({options:{seed:{type:'string',default:'2189'},bots:{type:'string',default:'36'},ticks:{type:'string',default:'250'},scenario:{type:'string',default:'paradox'},every:{type:'string',default:'50'},json:{type:'boolean'},help:{type:'boolean',short:'h'}}});
  if(values.help)console.log(help);
  else{
    const integer=s=>{if(!/^\d+$/.test(s)||!Number.isSafeInteger(Number(s)))throw new RangeError('Informe um inteiro não negativo.');return Number(s);};
    const every=integer(values.every);if(every<1)throw new RangeError('--every deve ser positivo.');
    const result=runEcho({seed:integer(values.seed),bots:integer(values.bots),ticks:integer(values.ticks),scenario:values.scenario,onFrame:(r,field)=>{
      if(!values.json&&r.tick%every===0)console.log(`\nECHO // ${String(r.tick).padStart(5,'0')} | estabilidade ${r.stability.toFixed(2)} | pluralidade ${r.plurality.toFixed(2)}\n${renderField(field)}\nCampo médio ${r.mean.toFixed(4)} | células acima do limiar ${r.nonzero}/120 | paradoxo ${r.contradiction?'SIM':'NÃO'}`);
    }});
    console.log(JSON.stringify(values.json?result:{ticks:result.ticks,firstContradiction:result.firstContradiction,summary:result.summary},null,2));
  }
}catch(e){console.error('Erro: '+e.message+'\n'+help);process.exitCode=1;}
