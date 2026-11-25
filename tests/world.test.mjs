import test from 'node:test';import assert from 'node:assert/strict';import {createWorld,stepWorld,runWorld,report,ACTIONS,POLICIES,LIMITS} from '../src/world.mjs';
test('reproducibility',()=>assert.deepEqual(runWorld({ticks:100}),runWorld({ticks:100})));
test('different seeds',()=>assert.notDeepEqual(runWorld({seed:1,ticks:50}),runWorld({seed:2,ticks:50})));
test('input immutable',()=>{const w=createWorld();const before=structuredClone(w);stepWorld(w);assert.deepEqual(w,before);});
test('invalid input rejected',()=>{for(const p of [{seed:-1},{seed:2**32},{bots:5},{bots:121},{bots:NaN},{ticks:-1},{ticks:10001},{ticks:1.5}])assert.throws(()=>runWorld(p));});
test('independent decisions and bounded adaptive memory',()=>{const w=runWorld({ticks:500});assert.equal(w.tick,500);assert.ok(new Set(w.bots.map(b=>b.action)).size>1);for(const b of w.bots){assert.ok(b.memory.length<=LIMITS.memory);assert.ok(b.memory.length>0);assert.ok(Object.values(b.values).some(v=>v>0));assert.ok(ACTIONS.includes(b.action));}assert.ok(POLICIES.includes(w.core.policy));assert.ok(w.core.memory.length<=LIMITS.memory);});
test('long horizon and metric bounds',()=>{const w=runWorld({seed:99,bots:60,ticks:1000});assert.equal(w.tick,1000);assert.ok(w.events.length<=LIMITS.events);assert.ok(w.series.length<=LIMITS.events);for(const v of Object.values(w.environment))assert.ok(Number.isFinite(v)&&v>=0&&v<=100);for(const b of w.bots)for(const k of ['energy','knowledge','affinity'])assert.ok(b[k]>=0&&b[k]<=100);});
test('aggregate counts and callback',()=>{let calls=0;const w=runWorld({bots:12,ticks:25,onStep:r=>{calls++;assert.equal(Object.values(r.actions).reduce((a,b)=>a+b,0),12);assert.equal(r.tick,calls);}});assert.equal(calls,25);assert.equal(report(w).bots,12);});
test('zero cycles and hard cap',()=>{assert.equal(runWorld({ticks:0}).tick,0);const w=createWorld();w.tick=LIMITS.maxTicks;assert.throws(()=>stepWorld(w));});

test('scenario comparison produces different synthetic outcomes',()=>{const p=report(runWorld({bots:36,ticks:500,scenario:'paradox'}));const b=report(runWorld({bots:36,ticks:500,scenario:'balance'}));assert.ok(p.plurality<b.plurality);assert.ok(p.contradiction);assert.equal(b.contradiction,false);});
test('unknown scenario rejected',()=>assert.throws(()=>runWorld({scenario:'unknown'})));
