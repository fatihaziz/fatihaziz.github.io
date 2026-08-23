// Telegram notifications for the Lunar tracker. Fire-and-forget: if no bot is
// configured (NUXT_TELEGRAM_BOT_TOKEN / NUXT_TELEGRAM_CHAT_ID unset) this is a
// no-op so the tracker still works on installs without secrets.
// Messages are structured HTML (product request 2026-07-21): bold headline,
// labeled fields, blockquote for notes, tracker link footer.
const TRACKER_URL = 'https://fatihaziz.com/clients/turnkey/lunar-project'

// Icon markers as unicode escapes (source stays ASCII-only).
const ICONS = {
  ball: '\u26BD',        // soccer ball
  task: '\u{1F4CC}',     // pushpin
  done: '\u2705',        // check mark
  feedback: '\u2757',    // exclamation
  question: '\u2753',    // question mark
  answer: '\u{1F4AC}',   // speech balloon
} as const

export interface LunarNotif {
  kind: keyof typeof ICONS
  title: string   // bold headline (plain text, will be escaped)
  intro?: string  // one plain sentence under the headline
  fields?: Array<{ label: string; value: string }>
  note?: string   // long/free text -> blockquote
}

function esc(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function render(n: LunarNotif): string {
  const parts: string[] = [`${ICONS[n.kind]} <b>${esc(n.title)}</b>`]
  if (n.intro) parts.push(esc(n.intro))
  const rows = (n.fields ?? []).filter((f) => f.value)
  if (rows.length) {
    parts.push(rows.map((f) => `- <b>${esc(f.label)}:</b> ${esc(f.value)}`).join('\n'))
  }
  if (n.note?.trim()) parts.push(`<blockquote>${esc(n.note.trim())}</blockquote>`)
  parts.push(`<a href="${TRACKER_URL}">Buka tracker</a>`)
  return parts.join('\n\n')
}

export async function notifyTelegram(notif: LunarNotif | string): Promise<{ sent: boolean; reason?: string }> {
  const cfg = useRuntimeConfig()
  const token = cfg.telegramBotToken
  const chatId = cfg.telegramChatId
  if (!token || !chatId) return { sent: false, reason: 'telegram not configured' }
  const text =
    typeof notif === 'string'
      ? `${esc(notif)}\n\n<a href="${TRACKER_URL}">Buka tracker</a>`
      : render(notif)
  try {
    const res = await $fetch<{ ok: boolean }>(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      body: { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true },
      timeout: 8000,
    })
    return { sent: !!res.ok }
  } catch (err: unknown) {
    // Never let a notification failure break the state change itself.
    console.error('[lunar] telegram notify failed:', err instanceof Error ? err.message : err)
    return { sent: false, reason: 'telegram send failed' }
  }
}
