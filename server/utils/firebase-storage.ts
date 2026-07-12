// server/utils/firebase-storage.ts
import { getStorage } from 'firebase-admin/storage'
import { randomUUID } from 'crypto'

const bucket = () => getStorage().bucket()

// Accepts a data URL (e.g. "data:image/avif;base64,...") and uploads it to
// Storage instead of writing the raw base64 into a Firestore document.
// Returns a public download URL to store in evidenceUrls instead.
export async function uploadEvidenceImage(dataUrl: string, reportId: string): Promise<string> {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
  if (!match) throw new Error('Invalid image data URL')

  const mimeType = match[1]
  const base64Data = match[2]
  if (!mimeType || !base64Data) throw new Error('Invalid image data URL')
  const buffer = Buffer.from(base64Data, 'base64')
  const ext = mimeType.split('/')[1] ?? 'bin'
  const filePath = `evidence/${reportId}/${randomUUID()}.${ext}`

  const file = bucket().file(filePath)
  await file.save(buffer, { contentType: mimeType, public: false })

  // Signed URL, long-lived — swap for a shorter expiry + refresh logic if
  // you want tighter control over link lifetime.
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '01-01-2099',
  })
  return url
}

export async function deleteEvidenceImage(url: string) {
  // Extract the storage path from a signed URL / gs path stored earlier.
  const path = decodeURIComponent(new URL(url).pathname.split('/o/')[1]?.split('?')[0] ?? '')
  if (!path) return
  await bucket().file(path).delete({ ignoreNotFound: true })
}