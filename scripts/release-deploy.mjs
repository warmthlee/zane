import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const projectRoot = process.cwd()
const distPath = path.join(projectRoot, 'dist')
const releaseDir = path.join(projectRoot, '.ai', 'releases')
const deploySummaryPath = path.join(releaseDir, 'latest-deploy.json')
const deployBranch = process.env.GITHUB_PAGES_BRANCH || 'gh-pages'
const deployRemoteName = process.env.GITHUB_PAGES_REMOTE || 'origin'
const deployMessage = process.env.GITHUB_PAGES_MESSAGE || 'Deploy blog to GitHub Pages'
const deployRepo = process.env.GITHUB_REPOSITORY || ''

const result = {
  timestamp: new Date().toISOString(),
  project: 'zane-blog',
  platform: 'GitHub Pages',
  branch: deployBranch,
  remote: deployRemoteName,
  status: 'success',
  notes: [],
  distPath,
}

fs.mkdirSync(releaseDir, { recursive: true })

const readRemoteUrl = () => {
  const override = process.env.GITHUB_PAGES_REMOTE_URL
  if (override && override.trim()) {
    return override.trim()
  }

  try {
    return execSync(`git remote get-url ${deployRemoteName}`, {
      cwd: projectRoot,
      encoding: 'utf8',
    }).trim()
  } catch {
    return ''
  }
}

try {
  if (!fs.existsSync(distPath)) {
    execSync('npm run build', { stdio: 'inherit', cwd: projectRoot })
  }

  const remoteUrl = readRemoteUrl()
  if (!remoteUrl.includes('github.com') && !deployRepo) {
    throw new Error('GitHub remote is required for GitHub Pages deployment. Configure GITHUB_PAGES_REMOTE_URL or push origin to GitHub.')
  }

  const ghPagesArgs = [
    'gh-pages',
    '-d',
    'dist',
    '-b',
    deployBranch,
    '--dotfiles',
    '--message',
    deployMessage,
  ]

  if (deployRepo) {
    ghPagesArgs.push('-r', `https://github.com/${deployRepo}.git`)
  } else if (remoteUrl) {
    ghPagesArgs.push('-r', remoteUrl)
  }

  const shellQuote = (value) => `"${String(value).replace(/"/g, '\\"')}"`
  const deployCommand = [
    'npx gh-pages',
    '--dist dist',
    '--branch ' + shellQuote(deployBranch),
    '--dotfiles',
    '--message ' + shellQuote(deployMessage),
  ]

  if (deployRepo) {
    deployCommand.push('--repo ' + shellQuote(`https://github.com/${deployRepo}.git`))
  } else if (remoteUrl) {
    deployCommand.push('--repo ' + shellQuote(remoteUrl))
  }

  execSync(deployCommand.join(' '), {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
    },
    shell: true,
  })

  result.notes = [
    'GitHub Pages deployment finished successfully.',
    `Remote: ${remoteUrl || deployRepo || 'configured via environment override'}`,
    `Branch: ${deployBranch}`,
  ]
} catch (error) {
  result.status = 'failed'
  result.notes = [
    'GitHub Pages deployment failed.',
    error instanceof Error ? error.message : String(error),
    'Set GITHUB_TOKEN / GH_TOKEN or ensure the repo has GitHub Pages push permissions.',
  ]
  fs.writeFileSync(deploySummaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  console.error('Static deployment failed.')
  process.exit(1)
}

fs.writeFileSync(deploySummaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
console.log(`GitHub Pages deployment succeeded. Summary saved to ${deploySummaryPath}`)
