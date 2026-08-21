// @ts-ignore: allow importing server util without type declarations
import { requireAdmin } from '../../utils/require-admin'

export default defineEventHandler(async (event) => {
  const decoded = await requireAdmin(event)
  return { admin: true, email: decoded.email }
})