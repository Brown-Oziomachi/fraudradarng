import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let dbInstance: Firestore | null = null
let initError: Error | null = null

function init(): Firestore {
  if (dbInstance) return dbInstance
  if (initError) throw initError

  const projectId = process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  const missing = [
    !projectId && 'NUXT_PUBLIC_FIREBASE_PROJECT_ID',
    !clientEmail && 'FIREBASE_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_PRIVATE_KEY',
  ].filter(Boolean)

  if (missing.length > 0) {
    initError = new Error(`Firebase Admin is missing required env vars: ${missing.join(', ')}`)
    console.error('[firebase-admin]', initError.message)
    throw initError
  }

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey } as {
          projectId: string
          clientEmail: string
          privateKey: string
        }),
      })
    }
    dbInstance = getFirestore()
    dbInstance.settings({ ignoreUndefinedProperties: true })
    return dbInstance
  } catch (err) {
    initError = err instanceof Error ? err : new Error(String(err))
    console.error('[firebase-admin] Failed to initialize:', initError.message)
    throw initError
  }
}
export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const instance = init()
    const value = Reflect.get(instance, prop, instance)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})