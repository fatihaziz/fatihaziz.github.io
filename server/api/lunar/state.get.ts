import {
  getSetting,
  listActivity,
  listFeatures,
  listFeedback,
  listQuestions,
  listSpLog,
  listSubtasks,
  listTasks,
} from '../../utils/lunar'

// One-shot dashboard payload: features coverage, subtasks, tasks, feedback,
// questions, activity, ball state and sprint-point accounting.
// Phase 2: SP spend derives from sp_log (daily worklogs), not task completion.
export default defineEventHandler(() => {
  const features = listFeatures()
  const tasks = listTasks()
  const feedback = listFeedback()
  const questions = listQuestions()
  const subtasks = listSubtasks()
  const activity = listActivity()

  const maxPerDay = Number(getSetting('max_points_per_day', '8')) || 8
  const today = new Date().toISOString().slice(0, 10)
  const since = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10)
  const logs = listSpLog(since)

  const spentToday = logs.filter((l) => l.spent_on === today).reduce((s, l) => s + l.points, 0)
  // 7-day burn: oldest -> today.
  const burn7: Array<{ day: string; points: number }> = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    burn7.push({ day, points: logs.filter((l) => l.spent_on === day).reduce((s, l) => s + l.points, 0) })
  }

  const allLogs = listSpLog('0000-00-00')
  const loggedByTask = new Map<number, number>()
  for (const l of allLogs) loggedByTask.set(l.task_id, (loggedByTask.get(l.task_id) ?? 0) + l.points)
  // Sprint spend counts only logs inside the sprint window, not all history.
  const sprintStart = getSetting('sprint_start', '0000-00-00')
  const sprintEnd = getSetting('sprint_end', '9999-12-31')
  const spentSprint = allLogs
    .filter((l) => l.spent_on >= sprintStart && l.spent_on <= sprintEnd)
    .reduce((s, l) => s + l.points, 0)
  // Cancelled and archived (soft-deleted) tasks are out of every SP figure: a
  // mis-created or dropped task must not inflate in-flight or open estimates.
  const inFlight = tasks
    .filter((t) => t.status === 'doing' && !t.archived)
    .reduce((s, t) => s + t.points, 0)
  const estimateOpen = tasks
    .filter((t) => t.status !== 'done' && t.status !== 'cancelled' && !t.archived)
    .reduce((s, t) => s + Math.max(0, t.points - (loggedByTask.get(t.id) ?? 0)), 0)

  const milestone = features.filter((f) => f.group_name === 'milestone')
  const trial = features.filter((f) => f.group_name === 'trial')
  const coverage = {
    issuesDone: milestone.reduce((s, f) => s + f.issues_done, 0),
    issuesTotal: milestone.reduce((s, f) => s + f.issues_total, 0),
    trialDone: trial.filter((f) => f.status === 'done').length,
    trialTotal: trial.length,
  }

  return {
    ball: {
      holder: getSetting('ball', 'dev'),
      note: getSetting('ball_note', ''),
      since: getSetting('ball_since', ''),
    },
    sprint: {
      start: getSetting('sprint_start', ''),
      end: getSetting('sprint_end', ''),
      maxPerDay,
      spentToday,
      availableToday: Math.max(0, maxPerDay - spentToday),
      spentSprint,
      inFlight,
      estimateOpen,
      burn7,
    },
    coverage,
    features,
    subtasks,
    tasks: tasks.map((t) => ({ ...t, logged_points: loggedByTask.get(t.id) ?? 0 })),
    // Per-day audit trail: who logged which SP on what, so "hari itu" is
    // reconstructable (sprint window only, newest first).
    worklog: allLogs
      .filter((l) => l.spent_on >= sprintStart && l.spent_on <= sprintEnd)
      .sort((a, b) => (a.spent_on < b.spent_on ? 1 : -1)),
    feedback,
    questions,
    activity,
  }
})
