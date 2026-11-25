import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const cli=fileURLToPath(new URL('../src/cli.mjs',import.meta.url));
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',timeout:10000});
test('CLI JSON is machine readable and autonomous',()=>{const p=run('--bots','12','--ticks','100','--json');assert.equal(p.status,0,p.stderr);const w=JSON.parse(p.stdout);assert.equal(w.tick,100);assert.equal(w.bots.length,12);});
test('CLI invalid arguments return failure',()=>{for(const args of [['--bots','121'],['--ticks','-1'],['--scenario','bad'],['--every','0'],['--unknown']])assert.equal(run(...args).status,1);});
test('CLI help is available',()=>{const p=run('--help');assert.equal(p.status,0);assert.match(p.stdout,/VÉRTICE/);});
