import test from 'node:test';import assert from 'node:assert/strict';import {createWorld,stepWorld,report} from '../autonomo/core.mjs';
const run=(seed,n)=>{let w=createWorld(seed);for(let i=0;i<n;i++)w=stepWorld(w);return w;};
test('determinism',()=>assert.deepEqual(run(2189,100),run(2189,100)));
test('seed variation',()=>assert.notDeepEqual(run(1,30),run(2,30)));
test('immutable input',()=>{const w=createWorld(),copy=structuredClone(w);stepWorld(w);assert.deepEqual(w,copy)});
test('bounded parameters',()=>{assert.throws(()=>createWorld(-1));assert.throws(()=>createWorld(1,61));assert.throws(()=>createWorld(1,5));});
test('500 cycles and bounded memory',()=>{const w=run(123,500);assert.equal(w.tick,500);assert.equal(w.bots.length,24);assert.ok(w.logs.length<=90);assert.ok(w.series.length<=120);for(const b of w.bots){assert.ok(b.memory.length<=12);assert.ok(b.memory.length>0);for(const k of ['energy','knowledge','affinity'])assert.ok(b[k]>=0&&b[k]<=100);}for(const k of ['energy','knowledge','cohesion','disagreement','meanEnergy'])assert.ok(report(w)[k]>=0&&report(w)[k]<=100);});
test('independent behavior and learning',()=>{const w=run(2189,20);assert.ok(new Set(w.bots.map(b=>b.action)).size>1);assert.ok(w.bots.some(b=>Object.values(b.value).some(v=>v>0)));});
