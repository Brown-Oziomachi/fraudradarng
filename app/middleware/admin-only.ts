export default defineNuxtRouteMiddleware(async () => {
  const { isAdmin } = useAuth()
  const admin = await isAdmin()

  if (!admin) {
    // 404 instead of 403 — don't confirm the route even exists.
    return navigateTo('/', { redirectCode: 404 })
  }
})