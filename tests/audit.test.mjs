import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { auditRun } from '../src/audit.mjs';
import { runWorld, report } from '../src/world.mjs';

test('audit is deterministic and leaves model behavior unchanged', () => {
  const options = { seed: 2189, bots: 12, ticks: 51, every: 10 };
  const a = auditRun(options);
  assert.deepEqual(a, auditRun(options));
  assert.deepEqual(a.final, report(runWorld(options)));
  assert.deepEqual(a.checkpoints.map(c => c.tick), [10, 20, 30, 40, 50, 51]);
  assert.match(a.traceHash, /^[a-f0-9]{64}$/);
});
test('checkpoint frequency does not change full trace digest', () => {
  const a = auditRun({ ticks: 31, every: 5 });
  const b = auditRun({ ticks: 31, every: 7 });
  assert.equal(a.traceHash, b.traceHash);
  assert.equal(a.finalHash, b.finalHash);
});
test('zero cycles, limits and changed seed', () => {
  const a = auditRun({ ticks: 0 });
  assert.equal(a.initialHash, a.finalHash);
  assert.equal(a.traceHash, a.initialHash);
  assert.deepEqual(a.checkpoints, []);
  assert.notEqual(a.initialHash, auditRun({ ticks: 0, seed: 1 }).initialHash);
  for (const opts of [{ every: 0 }, { every: 10001 }, { ticks: -1 }, { ticks: 10001 }]) {
    assert.throws(() => auditRun(opts), RangeError);
  }
});
test('audit CLI outputs JSON and rejects invalid arguments', () => {
  const path = fileURLToPath(new URL('../src/audit-cli.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [path, ...args], { encoding: 'utf8', timeout: 10000 });
  const a = run('--bots', '6', '--ticks', '10');
  assert.equal(a.status, 0, a.stderr);
  assert.equal(JSON.parse(a.stdout).final.tick, 10);
  assert.equal(run('--every', '0').status, 1);
});
