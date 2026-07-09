// server/api/dev/seed-verified-reports.ts
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  if (getApps().length === 0) {
    initializeApp()
  }

  const db = getFirestore()

  const seedData = [
    {
      id: 'rec_sec_cbex',
      targetType: 'company',
      category: 'job_ponzi',
      companyName: 'CBEX (Crypto Bridge Exchange) — ST Technologies International Limited',
      description: 'SEC flagged CBEX on April 17, 2025 as an unregistered and unlicensed operator soliciting public funds under promises of 100% returns in 30 days. Collapsed within days of the SEC notice, with investors unable to withdraw funds.',
      reason: 'investment_scam',
      contactPlatform: 'website',
      evidenceUrls: [],
      sourceUrl: 'https://www.legit.ng/business-economy/industry/1664638-full-list-sec-names-79-suspected-ponzi-schemes-nigeria-issues-fresh-warning/',
      reportCount: 1,
      distinctReporterCount: 0,
      status: 'flagged',
      createdAt: '2025-04-17T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z'
    },
    {
      id: 'rec_sec_sapphire_scents',
      targetType: 'company',
      category: 'job_ponzi',
      companyName: 'Sapphire Scents Limited',
      description: 'SEC flagged this company on June 19, 2025 for moving from lifestyle/fragrance branding into unregistered investment offerings, promising high returns without licensed financial activity.',
      reason: 'investment_scam',
      contactPlatform: 'website',
      evidenceUrls: [],
      sourceUrl: 'https://www.legit.ng/business-economy/capital-market/1696589-how-nigerias-top-ponzi-platforms-disappear-money-secs-latest-warning/',
      reportCount: 1,
      distinctReporterCount: 0,
      status: 'flagged',
      createdAt: '2025-06-19T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z'
    },
    {
      id: 'rec_sec_glorious_wealth_fund',
      targetType: 'website',
      category: 'job_ponzi',
      websiteUrl: 'gloriouswealthfund.com',
      websiteName: 'Glorious Wealth Fund (GWF)',
      description: 'SEC described GWF as an illegal and potentially fraudulent operation, not registered to offer capital market services in Nigeria despite soliciting public investment.',
      reason: 'investment_scam',
      contactPlatform: 'website',
      evidenceUrls: [],
      sourceUrl: 'https://nairametrics.com/2026/05/14/sec-warns-nigerians-against-rising-ponzi-schemes-on-whatsapp-tiktok-instagram/',
      reportCount: 1,
      distinctReporterCount: 0,
      status: 'flagged',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z'
    },
    {
      id: 'rec_sec_cmtrading',
      targetType: 'company',
      category: 'job_ponzi',
      companyName: 'CMTrading',
      description: 'SEC flagged CMTrading on June 20, 2025 for using cloned media branding and celebrity images to promote unregistered trading opportunities, relying on referral payouts rather than licensed operations.',
      reason: 'investment_scam',
      contactPlatform: 'website',
      evidenceUrls: [],
      sourceUrl: 'https://www.legit.ng/business-economy/capital-market/1696589-how-nigerias-top-ponzi-platforms-disappear-money-secs-latest-warning/',
      reportCount: 1,
      distinctReporterCount: 0,
      status: 'flagged',
      createdAt: '2025-06-20T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z'
    },
    {
      id: 'rec_sec_silverkuun',
      targetType: 'company',
      category: 'job_ponzi',
      companyName: 'Silverkuun Investment Cooperative Society / Silverkuun Limited',
      description: 'SEC warned that Silverkuun, which advertises fixed savings, loans, and high-return investment options, is not registered to operate within Nigeria\u2019s capital market.',
      reason: 'investment_scam',
      contactPlatform: 'website',
      evidenceUrls: [],
      sourceUrl: 'https://nairametrics.com/2026/05/14/sec-warns-nigerians-against-rising-ponzi-schemes-on-whatsapp-tiktok-instagram/',
      reportCount: 1,
      distinctReporterCount: 0,
      status: 'flagged',
      createdAt: '2025-11-01T00:00:00.000Z',
      updatedAt: '2026-07-08T00:00:00.000Z'
    }
  ]

  const collectionRef = db.collection('reports')

  for (const record of seedData) {
    const { id, ...dataWithoutId } = record
    await collectionRef.doc(id).set(dataWithoutId)
  }

  return { success: true, message: `${seedData.length} SEC-verified records seeded successfully.` }
})