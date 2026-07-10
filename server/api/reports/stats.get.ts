import { getReportStats } from "../../utils/db"

export default defineCachedEventHandler(() => {
  return getReportStats()
}, {
  maxAge: 30,
  name: 'reports-stats',
  getKey: () => 'stats'
})