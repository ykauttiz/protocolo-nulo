// Deterministic fictional civic model; not a real-world prediction system.
export const DISTRICTS=[{id:'archive',name:'Arquivo',type:'Memória e pesquisa',base:[68,48,55]},{id:'garden',name:'Jardins',type:'Habitação e bem-estar',base:[58,62,52]},{id:'transit',name:'Eixo',type:'Mobilidade e serviços',base:[76,43,45]},{id:'forum',name:'Ágora',type:'Participação civil',base:[53,59,69]}];
const bound=n=>Math.max(0,Math.min(100,Math.round(n)));
export function simulate(state){
 const city=DISTRICTS.map(d=>({id:d.id,name:d.name,type:d.type,services:d.base[0],equity:d.base[1],participation:d.base[2]}));const timeline=[];
 for(const step of state.history){const m=step.metrics;const prior=city.map(d=>({...d}));const network=prior.reduce((sum,d)=>sum+d.services,0)/prior.length;
  for(const [i,d] of city.entries()){const p=prior[i],neighbor=prior[(i+3)%4];const targetService=m.stability*.55+m.trust*.25+network*.20;const targetEquity=m.liberty*.45+m.evidence*.25+m.trust*.30;const targetParticipation=m.trust*.5+m.liberty*.35+neighbor.participation*.15;
   d.services=bound(p.services*.70+targetService*.30+(i===2?2:0));d.equity=bound(p.equity*.68+targetEquity*.32+(i===0?(m.evidence-50)/18:0));d.participation=bound(p.participation*.65+targetParticipation*.35+(i===3?2:0));
  }
  const average=k=>Math.round(city.reduce((sum,d)=>sum+d[k],0)/city.length);timeline.push({turn:Number(step.chapter),services:average('services'),equity:average('equity'),participation:average('participation')});
 }
 const average=k=>Math.round(city.reduce((sum,d)=>sum+d[k],0)/city.length);const summary={services:average('services'),equity:average('equity'),participation:average('participation')};const weakest=city.reduce((a,b)=>a.equity<=b.equity?a:b);let bulletin='Os quatro distritos aguardam o início da auditoria.';
 if(state.turn){if(summary.equity<40)bulletin='O conselho recebe pedidos de revisão sobre desigualdade no acesso aos serviços.';else if(summary.services<45)bulletin='A rede de serviços solicita atenção à continuidade operacional.';else if(summary.participation>=65)bulletin='As assembleias distritais registram maior participação voluntária.';else bulletin='O conselho acompanha resultados mistos; novas decisões podem alterar o equilíbrio.';}
 return {city,summary,timeline,bulletin,weakest:weakest.name};
}
