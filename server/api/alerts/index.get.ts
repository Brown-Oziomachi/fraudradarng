import { db } from '~~/server/utils/firebase-admin'

export default defineEventHandler(async () => {
  const snap = await db.collection('official_alerts')
    .orderBy('publishedAt', 'desc')
    .limit(50)
    .get()

  return {
    alerts: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
  }
})