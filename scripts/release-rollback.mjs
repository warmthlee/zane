import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const latestCheckPath = path.join(projectRoot, '.ai', 'releases', 'latest-check.json')
const rollbackPath = path.join(projectRoot, '.ai', 'releases', 'rollback-plan.json')

const baselinePlan = {
  timestamp: new Date().toISOString(),
  status: 'ready',
  steps: [
    '1. Restore the previous publish artifact or git revision that was known-good.',
    '2. Re-upload the previous dist output to the target hosting environment.',
    '3. Re-check the site health and ensure route fallback and static assets are still resolving.',
    '4. Record the failure and the remediation steps for the next release attempt.',
  ],
  releaseGate: fs.existsSync(latestCheckPath) ? JSON.parse(fs.readFileSync(latestCheckPath, 'utf8')) : null,
}

fs.writeFileSync(rollbackPath, `${JSON.stringify(baselinePlan, null, 2)}\n`, 'utf8')
console.log(`Rollback plan saved to ${rollbackPath}`)
console.log('Use the plan as the minimal recovery checklist before retrying a release.')
