import { getAllReports } from "../utils/db"

export default defineEventHandler(() => {
  return getAllReports()
})