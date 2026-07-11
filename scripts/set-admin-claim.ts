// scripts/set-admin-claim.ts
// Run ONCE locally: npx tsx scripts/set-admin-claim.ts <your-uid>
// Requires the same FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY /
// NUXT_PUBLIC_FIREBASE_PROJECT_ID env vars your server already uses.
// Delete this file (or at least never expose it as an API route) once done.

import 'dotenv/config'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const uid = process.argv[2]
if (!uid) {
  console.error('Usage: npx tsx scripts/set-admin-claim.ts <uid>')
  process.exit(1)
}

initializeApp({
  credential: cert({
    projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  }),
})

await getAuth().setCustomUserClaims(uid, { admin: true })
console.log(`Admin claim set for ${uid}. They must sign out and back in for it to take effect.`)