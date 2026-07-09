// server/api/contact.post.ts
import { addContactMessage } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; message?: string }>(event)

  if (!body.name || !body.email || !body.message) {
    throw createError({ statusCode: 400, statusMessage: 'Please fill in all fields.' })
  }

  await addContactMessage({
    name: body.name,
    email: body.email,
    message: body.message
  })

  setResponseStatus(event, 201)
  return { success: true }
})