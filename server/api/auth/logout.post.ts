export default defineEventHandler(async (event) => {
  deleteCookie(event, '__session', { path: '/' })
  return { ok: true }
})