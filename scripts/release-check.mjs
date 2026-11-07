import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execSync } from 'node:child_process'

const projectRoot = process.cwd()
const releaseDir = path.join(projectRoot, '.ai', 'releases')
const summaryPath = path.join(releaseDir, 'latest-check.json')
const migrationDbPath = path.join(os.tmpdir(), `zane-migration-check-${process.pid}.db`)

const migrationConnection = `Data Source=${migrationDbPath}`

const commandList = [
  'npm run build',
  'npm run lint',
  'dotnet build src-dotnet/Zane.sln',
  'dotnet test src-dotnet/Zane.sln --no-build',
  'dotnet tool restore',
  'dotnet ef migrations has-pending-model-changes --project src-dotnet/Zane.Api',
  `dotnet ef database update --project src-dotnet/Zane.Api --connection "${migrationConnection}"`,
  // SQLite 不支持幂等脚本，重复执行 update 验证迁移可重复应用。
  `dotnet ef database update --project src-dotnet/Zane.Api --connection "${migrationConnection}"`,
]

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
  cleanup()
  process.exit(1)
}

result.notes = ['build, lint, backend tests and repeatable migration rehearsal passed for the release gate']
fs.writeFileSync(summaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
console.log(`Release validation succeeded. Summary saved to ${summaryPath}`)
cleanup()

function cleanup() {
  for (const filePath of [
    migrationDbPath,
    `${migrationDbPath}-shm`,
    `${migrationDbPath}-wal`,
  ]) {
    try {
      fs.rmSync(filePath, { force: true })
    } catch {
      // 临时文件清理失败不影响发布检查结论。
    }
  }
}
