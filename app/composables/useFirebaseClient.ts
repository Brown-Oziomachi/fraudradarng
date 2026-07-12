// composables/useFirebaseClient.ts
//
// Client-side Firebase app + Firestore instance, shared across components.
// Uses the same init pattern already working in pages/admin/announcements.vue —
// just centralized so AnnouncementBar.vue (and anything else client-side)
// doesn't need its own copy.
//
// This must only ever run in the browser. Nuxt's useRuntimeConfig() and
// getApps()/initializeApp() are safe to call from setup(), but callers
// should still guard actual Firestore reads/writes with `import.meta.client`
// since this composable can technically be imported into SSR-rendered code.

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { useRuntimeConfig } from '#imports'

let dbInstance: Firestore | null = null

export function useFirebaseClient() {
  if (!dbInstance) {
    const config = useRuntimeConfig()
    const firebaseApp = getApps().length
      ? getApps()[0]!
      : initializeApp({
          apiKey: config.public.firebaseApiKey,
          authDomain: config.public.firebaseAuthDomain,
          projectId: config.public.firebaseProjectId,
          storageBucket: config.public.firebaseStorageBucket,
          appId: config.public.firebaseAppId,
        })
    dbInstance = getFirestore(firebaseApp)
  }
  return { db: dbInstance }
}