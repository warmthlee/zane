import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const projectRoot = process.cwd()
const releaseDir = path.join(projectRoot, '.ai', 'releases')
const summaryPath = path.join(releaseDir, 'latest-check.json')

const commandList = ['npm run build', 'npm run lint']

fs.mkdirSync(releaseDir, { recursive: true })

const result = {
  timestamp: new Date().toISOString(),
  project: 'zane-blog',
  commands: commandList,
  status: 'success',
  notes: [],
}

try {
  for (const command of commandList) {
    execSync(command, { stdio: 'inherit', cwd: projectRoot })
  }
} catch (error) {
  result.status = 'failed'
  result.notes = [
    'A validation failure was detected during the release gate.',
    error instanceof Error ? error.message : String(error),
  ]
  fs.writeFileSync(summaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  console.error('Release validation failed.')
  process.exit(1)
}

result.notes = ['build and lint passed for the release gate']
fs.writeFileSync(summaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
console.log(`Release validation succeeded. Summary saved to ${summaryPath}`)
