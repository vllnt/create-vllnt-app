#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['audit', '--json'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});

if (result.error) {
  console.error('Failed to run pnpm audit --json.');
  console.error(result.error.message);
  process.exit(1);
}

const stdout = (result.stdout ?? '').trim();
const stderr = (result.stderr ?? '').trim();
const jsonOutput = stdout || stderr;

if (!jsonOutput) {
  console.error('pnpm audit produced no JSON output.');
  process.exit(result.status ?? 1);
}

let audit;
try {
  audit = JSON.parse(jsonOutput);
} catch (error) {
  console.error('Failed to parse pnpm audit JSON output.');
  console.error(error instanceof Error ? error.message : String(error));
  if (stderr && stdout) {
    console.error('pnpm audit stderr:');
    console.error(stderr);
  }
  process.exit(1);
}

const vulnerabilities = audit.metadata?.vulnerabilities;
if (!vulnerabilities) {
  console.error('pnpm audit JSON did not include metadata.vulnerabilities.');
  process.exit(1);
}

const low = Number(vulnerabilities.low ?? 0);
const moderate = Number(vulnerabilities.moderate ?? 0);
const high = Number(vulnerabilities.high ?? 0);
const critical = Number(vulnerabilities.critical ?? 0);

console.log(`pnpm audit vulnerabilities: low=${low}, moderate=${moderate}, high=${high}, critical=${critical}`);

if (high > 0 || critical > 0) {
  console.error('High or critical vulnerabilities found. Run pnpm audit --json for details.');
  process.exit(1);
}

// Low and moderate advisories stay visible in the summary above, but the CI gate
// intentionally blocks only high/critical metadata. This keeps the known low
// workspace-path cli advisory (GHSA-6cpc-mj5c-m9rq) from failing the baseline gate.
console.log('No high or critical vulnerabilities found.');
