import { getLunarUser } from '../../../utils/lunar-auth'

// Who am I? Returns { user: null } for anonymous readers (read stays public).
export default defineEventHandler((event) => {
  return { user: getLunarUser(event) }
})
