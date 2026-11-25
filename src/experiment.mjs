// Read-only observability and paired-seed experiments; no external services.
import {ACTIONS, POLICIES, LIMITS, runWorld, report} from './world.mjs';
const METRICS = Object.freeze(['energy','knowledge','cohesion','plurality','stability']);
const mean = xs => xs.reduce((sum,x)=>sum+x,0)/xs.length;
export const EXPERIMENT_LIMITS = Object.freeze({replicates:32, agentCycles:2_000_000});
export function entropy(counts){
  const values=Object.values(counts);
  if(!values.length||values.some(x=>!Number.isFinite(x)||x<0))throw new RangeError('Contagens inválidas.');
  const total=values.reduce((a,b)=>a+b,0);
  if(total===0||values.length===1)return 0;
  return Math.max(0,Math.min(1,-values.reduce((sum,x)=>x?sum+(x/total)*Math.log(x/total):sum,0)/Math.log(values.length)));
}
export function describe(samples){
  if(!Array.isArray(samples)||!samples.length||samples.some(x=>!Number.isFinite(x)))throw new RangeError('Amostra inválida.');
  const m=mean(samples), sorted=[...samples].sort((a,b)=>a-b), n=samples.length;
  return {n,mean:m,min:sorted[0],max:sorted.at(-1),median:n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2,sd:n===1?null:Math.sqrt(samples.reduce((s,x)=>s+(x-m)**2,0)/(n-1))};
}
export function observeRun({seed=2189,bots=36,ticks=250,scenario='paradox'}={}){
  const policies=Object.fromEntries(POLICIES.map(p=>[p,0]));
  const actionTotals=Object.fromEntries(ACTIONS.map(a=>[a,0]));
  const sums=Object.fromEntries(METRICS.map(m=>[m,0]));
  let contradictionTicks=0,firstContradiction=null,longestContradiction=0,streak=0,entropySum=0,policyChanges=0,previousPolicy=null;
  const world=runWorld({seed,bots,ticks,scenario,onStep:r=>{
    policies[r.policy]++;
    if(previousPolicy!==null&&r.policy!==previousPolicy)policyChanges++;
    previousPolicy=r.policy;
    for(const a of ACTIONS)actionTotals[a]+=r.actions[a];
    for(const m of METRICS)sums[m]+=r[m];
    entropySum+=entropy(r.actions);
    if(r.contradiction){contradictionTicks++;streak++;longestContradiction=Math.max(streak,longestContradiction);firstContradiction??=r.tick;}else streak=0;
  }});
  return {seed,scenario,bots,ticks,final:report(world),policies,actionTotals,policyChanges,meanActionEntropy:ticks?entropySum/ticks:null,meanMetrics:Object.fromEntries(METRICS.map(m=>[m,ticks?sums[m]/ticks:null])),contradictionTicks,firstContradiction,longestContradiction,contradictionFraction:ticks?contradictionTicks/ticks:null,agentKnowledge:describe(world.bots.map(b=>b.knowledge))};
}
export function compareScenarios({seed=2189,bots=36,ticks=250,replicates=8}={}){
  if(!Number.isInteger(seed)||seed<0||seed>0xffffffff||!Number.isInteger(bots)||bots<LIMITS.minBots||bots>LIMITS.maxBots||!Number.isInteger(ticks)||ticks<1||ticks>LIMITS.maxTicks||!Number.isInteger(replicates)||replicates<1||replicates>EXPERIMENT_LIMITS.replicates||bots*ticks*replicates*2>EXPERIMENT_LIMITS.agentCycles)throw new RangeError('Experimento fora dos limites.');
  const pairs=[];
  for(let i=0;i<replicates;i++){
    const pairedSeed=(seed+i)>>>0;
    pairs.push({seed:pairedSeed,balance:observeRun({seed:pairedSeed,bots,ticks,scenario:'balance'}),paradox:observeRun({seed:pairedSeed,bots,ticks,scenario:'paradox'})});
  }
  const deltas=Object.fromEntries(METRICS.map(m=>[m,describe(pairs.map(p=>p.paradox.final[m]-p.balance.final[m]))]));
  return {version:1,parameters:{seed,bots,ticks,replicates},interpretation:'Diferenças paradox - balance; hipóteses sintéticas, sem inferência sobre pessoas reais.',summary:{finalMetricDifferences:deltas,contradictionFractionDifference:describe(pairs.map(p=>p.paradox.contradictionFraction-p.balance.contradictionFraction)),meanActionEntropyDifference:describe(pairs.map(p=>p.paradox.meanActionEntropy-p.balance.meanActionEntropy))},pairs};
}
