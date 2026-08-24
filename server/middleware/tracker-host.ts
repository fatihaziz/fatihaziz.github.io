// Tracker lives on its own hostname now: tracker.fatihaziz.com.
// The apex is the portfolio landing, so any /clients/* request that still
// arrives there is redirected permanently to the tracker host with the SAME
// path and query preserved (old links keep working).
const TRACKER_HOST = 'tracker.fatihaziz.com';
const APEX_HOSTS: Record<string, true> = { 'fatihaziz.com': true, 'www.fatihaziz.com': true };

export default defineEventHandler((event) => {
  const host = (getRequestHeader(event, 'host') || '').split(':')[0].toLowerCase();
  if (!APEX_HOSTS[host]) return;

  const url = getRequestURL(event);
  if (!url.pathname.startsWith('/clients/')) return;

  return sendRedirect(event, `https://${TRACKER_HOST}${url.pathname}${url.search}`, 301);
});
