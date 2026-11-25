import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditRun } from '../src/audit.mjs';

const reference = JSON.parse(readFileSync(new URL('../evidence/reference.json', import.meta.url), 'utf8'));
assert.equal(reference.schema, 1);
assert.equal(reference.runs.length, 2);
for (const expected of reference.runs) {
  const actual = auditRun(expected.parameters);
  assert.deepEqual(actual, expected, `Reference mismatch: ${expected.parameters.scenario}`);
  console.log(`${actual.parameters.scenario}: verified ${actual.traceHash}`);
}
