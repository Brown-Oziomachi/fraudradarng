import { signInWithEmailAndPassword, signOut as fbSignOut, type User } from 'firebase/auth'

export function useAuth() {
  const { $firebaseAuth, $authReadyPromise } = useNuxtApp() as any
  const currentUser = useState<User | null>('firebase-user')
  const authReady = useState<boolean>('firebase-auth-ready', () => false)

  async function waitForAuthReady() {
    await $authReadyPromise
  }

  async function isAdmin(): Promise<boolean> {
    await waitForAuthReady()
    const user = currentUser.value
    if (!user) return false
    const tokenResult = await user.getIdTokenResult()
    return tokenResult.claims.admin === true
  }

  async function getAuthHeader(): Promise<Record<string, string>> {
    await waitForAuthReady()
    const user = currentUser.value
    if (!user) return {}
    const token = await user.getIdToken()
    return { Authorization: `Bearer ${token}` }
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword($firebaseAuth, email, password)
  }

  async function logout() {
    await fbSignOut($firebaseAuth)
  }

  return { currentUser, authReady, waitForAuthReady, isAdmin, getAuthHeader, login, logout }
}