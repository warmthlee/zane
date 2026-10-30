import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const projectRoot = process.cwd()
const archiveDir = path.join(projectRoot, '.ai')
const archivePath = path.join(archiveDir, 'session-archive.db')
const jsonArchivePath = path.join(archiveDir, 'session-archive.json')
const db = new DatabaseSync(archivePath)

db.exec(`
  CREATE TABLE IF NOT EXISTS session_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    workspace TEXT,
    agent TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

const args = process.argv.slice(2)
const summaryMode = args.includes('--summary')
const validStatuses = new Set(['pending', 'in_progress', 'done', 'blocked'])

const exportJsonArchive = () => {
  const rows = db
    .prepare(
      'SELECT id, timestamp, title, status, notes, workspace, agent, created_at FROM session_events ORDER BY id ASC',
    )
    .all()

  fs.writeFileSync(jsonArchivePath, `${JSON.stringify(rows, null, 2)}\n`, 'utf8')
  return rows
}

if (summaryMode) {
  const rows = db
    .prepare(
      'SELECT id, timestamp, title, status, notes, workspace, agent FROM session_events ORDER BY timestamp DESC LIMIT 5',
    )
    .all()

  if (rows.length === 0) {
    console.log('No archived sessions yet.')
    db.close()
    process.exit(0)
  }

  console.log('Recent session archive:')
  rows.forEach((entry) => {
    console.log(`- ${entry.timestamp} :: ${entry.title} [${entry.status}]`)
  })
  db.close()
  process.exit(0)
}

const title = args[0] ?? 'Manual session checkpoint'
const rawStatus = args[1] ?? 'in_progress'
const status = validStatuses.has(rawStatus) ? rawStatus : 'in_progress'
const notes = args.slice(2).join(' ') || 'No additional notes supplied.'

const nextEntry = {
  timestamp: new Date().toISOString(),
  title,
  status,
  notes,
  workspace: projectRoot,
  agent: process.env.npm_config_user_agent || 'local-shell',
}

const insert = db.prepare(
  'INSERT INTO session_events (timestamp, title, status, notes, workspace, agent) VALUES (?, ?, ?, ?, ?, ?)',
)
insert.run(
  nextEntry.timestamp,
  nextEntry.title,
  nextEntry.status,
  nextEntry.notes,
  nextEntry.workspace,
  nextEntry.agent,
)

exportJsonArchive()

db.close()
console.log(`Archived session entry: ${title} (${status})`)
console.log(`Saved to ${archivePath}. JSON export written to ${jsonArchivePath}`)
