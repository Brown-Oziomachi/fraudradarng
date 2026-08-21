export function useAuth() {
  const isAdminUser = useState<boolean | null>('is-admin-user', () => null)

  async function isAdmin(): Promise<boolean> {
    try {
      // Forward the cookie on SSR; the browser sends it automatically on client-side $fetch.
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      await $fetch('/api/auth/verify-session', { headers })
      isAdminUser.value = true
      return true
    } catch {
      isAdminUser.value = false
      return false
    }
  }

  // Cookie is httpOnly and sent automatically by the browser on same-origin
  // requests — no Authorization header needed anymore. Kept as a no-op so
  // existing $fetch(..., { headers }) call sites don't need to change.
  async function getAuthHeader(): Promise<Record<string, string>> {
    return {}
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/session-login', {
      method: 'POST',
      body: { email, password }
    })
    isAdminUser.value = true
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    isAdminUser.value = false
  }

  return { isAdmin, getAuthHeader, login, logout }
}