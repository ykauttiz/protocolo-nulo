import { parseArgs } from 'node:util';
import { auditRun } from './audit.mjs';

try {
  const { values } = parseArgs({ options: {
    seed: { type: 'string', default: '2189' },
    bots: { type: 'string', default: '36' },
    ticks: { type: 'string', default: '250' },
    every: { type: 'string', default: '25' },
    scenario: { type: 'string', default: 'paradox' },
    help: { type: 'boolean', short: 'h' }
  } });
  if (values.help) {
    console.log('VÉRTICE | Audit: --seed 2189 --bots 36 --ticks 250 --every 25 --scenario paradox|balance');
  } else {
    const params = { scenario: values.scenario };
    for (const key of ['seed', 'bots', 'ticks', 'every']) {
      if (!/^\d+$/.test(values[key]) || !Number.isSafeInteger(Number(values[key]))) {
        throw new RangeError(`Invalid ${key}.`);
      }
      params[key] = Number(values[key]);
    }
    console.log(JSON.stringify(auditRun(params), null, 2));
  }
} catch (error) {
  console.error(`Audit error: ${error.message}`);
  process.exitCode = 1;
}
