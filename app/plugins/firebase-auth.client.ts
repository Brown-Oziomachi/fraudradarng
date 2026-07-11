import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    appId: config.public.firebaseAppId,
  }

  console.log('[firebase-auth plugin] config:', firebaseConfig)

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  const auth = getAuth(app)

  const currentUser = useState<User | null>('firebase-user', () => null)
  const authReady = useState<boolean>('firebase-auth-ready', () => false)

  // Resolves once Firebase has restored (or confirmed absence of) a
  // signed-in user from IndexedDB. Everything that needs to know
  // "are we logged in" must await this first — this is what prevents
  // the refresh race where a fetch fires before auth state exists.
  let resolveReady: () => void
  const readyPromise = new Promise<void>((resolve) => { resolveReady = resolve })

  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    if (!authReady.value) {
      authReady.value = true
      resolveReady()
    }
  })

  return {
    provide: {
      firebaseAuth: auth,
      authReadyPromise: readyPromise,
    },
  }
})