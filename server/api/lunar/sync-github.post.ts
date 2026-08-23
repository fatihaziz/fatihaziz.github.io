import { getLunarDb } from '../../utils/lunar'
import { requireLunarUser } from '../../utils/lunar-auth'

const OWNER = 'turnkey-devs'
const REPO = 'lunar-crm-project'

interface GhCommit {
  sha: string
  html_url: string
  commit: { message: string; author?: { name?: string; date?: string } }
}
interface GhIssue {
  number: number
  title: string
  state: string
  html_url: string
  user?: { login?: string }
  updated_at: string
  pull_request?: unknown
}

// Pull latest commits + issues from GitHub into the activity table.
// Requires NUXT_GITHUB_TOKEN when the repo is private.
export default defineEventHandler(async (event) => {
  requireLunarUser(event, ['dev'])
  const token = useRuntimeConfig().githubToken
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'fatihaziz-lunar-tracker',
  }
  if (token) headers.authorization = `Bearer ${token}`

  const base = `https://api.github.com/repos/${OWNER}/${REPO}`
  let commits: GhCommit[] = []
  let issues: GhIssue[] = []
  try {
    ;[commits, issues] = await Promise.all([
      $fetch<GhCommit[]>(`${base}/commits?per_page=30`, { headers, timeout: 15000 }),
      $fetch<GhIssue[]>(`${base}/issues?state=all&per_page=50&sort=updated`, { headers, timeout: 15000 }),
    ])
  } catch (err: unknown) {
    throw createError({
      statusCode: 502,
      statusMessage: `GitHub sync failed (repo private? set NUXT_GITHUB_TOKEN): ${err instanceof Error ? err.message : 'unknown'}`,
    })
  }

  const db = getLunarDb()
  const upsert = db.prepare(
    `INSERT INTO activity (kind, ref, title, state, author, url, happened_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(kind, ref) DO UPDATE SET title = excluded.title, state = excluded.state, author = excluded.author, url = excluded.url, happened_at = excluded.happened_at`,
  )
  const tx = db.transaction(() => {
    for (const c of commits) {
      upsert.run(
        'commit',
        c.sha.slice(0, 7),
        c.commit.message.split('\n')[0].slice(0, 300),
        'done',
        c.commit.author?.name ?? '',
        c.html_url,
        c.commit.author?.date ?? new Date().toISOString(),
      )
    }
    for (const i of issues) {
      if (i.pull_request) continue
      upsert.run(
        'issue',
        `#${i.number}`,
        i.title.slice(0, 300),
        i.state === 'closed' ? 'done' : 'running',
        i.user?.login ?? '',
        i.html_url,
        i.updated_at,
      )
    }
    // Phase 3 (q5 github_sync): subtasks track their GitHub issue - a closed
    // issue closes its subtask, a reopened one puts it back to doing.
    const setSub = db.prepare('UPDATE subtasks SET status = ? WHERE issue_ref = ?')
    for (const i of issues) {
      if (i.pull_request) continue
      setSub.run(i.state === 'closed' ? 'done' : 'doing', `#${i.number}`)
    }
    // Refresh seeded subtask placeholder titles with the real issue titles.
    const setTitle = db.prepare("UPDATE subtasks SET title = ? WHERE issue_ref = ? AND title LIKE 'Issue #%'")
    for (const i of issues) {
      if (!i.pull_request) setTitle.run(i.title.slice(0, 300), `#${i.number}`)
    }
  })
  tx()
  return { synced: { commits: commits.length, issues: issues.length } }
})
