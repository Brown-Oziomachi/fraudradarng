import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (getApps().length === 0) {
  console.log('DEBUG projectId:', process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID)
  initializeApp({
    credential: cert({
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NUXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NUXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      
    }),
  })
}

export const db = getFirestore()

// By default, the Admin SDK throws an error if you try to save a
// field whose value is `undefined` (e.g. evidenceUrl when no
// screenshot was attached). This tells Firestore to simply omit
// those fields instead of erroring — exactly the behavior we want
// for optional fields like evidenceUrl and reason.
db.settings({ ignoreUndefinedProperties: true })