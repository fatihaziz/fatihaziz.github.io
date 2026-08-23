import { setSetting, getSetting } from '../../utils/lunar'
import { notifyTelegram } from '../../utils/lunar-telegram'
import { requireLunarUser } from '../../utils/lunar-auth'

// Global ball ("gambar bola"): whose court the project is in right now.
// dev -> product = developer handed over, waiting for team feedback (Telegram ping).
export default defineEventHandler(async (event) => {
  requireLunarUser(event)
  const body = await readBody(event)
  const holder = body?.holder === 'product' ? 'product' : 'dev'
  const note = typeof body?.note === 'string' ? body.note.slice(0, 300) : ''
  const prev = getSetting('ball', 'dev')

  setSetting('ball', holder)
  setSetting('ball_note', note)
  setSetting('ball_since', new Date().toISOString())

  if (prev !== holder) {
    notifyTelegram(
      holder === 'product'
        ? {
            kind: 'ball' as const,
            title: 'BOLA di TIM PRODUCT',
            intro: 'Developer selesai dan menunggu feedback kalian.',
            note,
          }
        : { kind: 'ball' as const, title: 'BOLA kembali ke DEVELOPER', note },
    ).catch(() => {})
  }
  return { holder, note, since: getSetting('ball_since') }
})
