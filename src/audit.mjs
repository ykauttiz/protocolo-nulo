import { createHash } from 'node:crypto';
import { createWorld, stepWorld, report, LIMITS } from './world.mjs';

const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Observe the original simulation without changing its rules or rewards.
export function auditRun({ seed = 2189, bots = 36, ticks = 250, scenario = 'paradox', every = 25 } = {}) {
  if (!Number.isInteger(ticks) || ticks < 0 || ticks > LIMITS.maxTicks ||
      !Number.isInteger(every) || every < 1 || every > LIMITS.maxTicks) {
    throw new RangeError('Invalid audit interval or horizon.');
  }
  let world = createWorld({ seed, bots, scenario });
  const initialHash = digest(world);
  let chain = initialHash;
  const checkpoints = [];
  let firstContradiction = null;
  let contradictionTicks = 0;
  for (let i = 0; i < ticks; i++) {
    world = stepWorld(world);
    const summary = report(world);
    chain = digest([chain, summary]);
    if (summary.contradiction) {
      firstContradiction ??= summary.tick;
      contradictionTicks++;
    }
    if (summary.tick % every === 0 || summary.tick === ticks) {
      checkpoints.push({ ...summary, chain });
    }
  }
  return {
    schema: 1,
    parameters: { seed, bots, ticks, scenario, every },
    initialHash, finalHash: digest(world), traceHash: chain,
    firstContradiction, contradictionTicks,
    final: report(world), checkpoints
  };
}
