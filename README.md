fraud-radar-ng/
├── app/
│   ├── components/
│   │   ├── ReportCard.vue
│   │   ├── ReportForm.vue
│   │   ├── SubscribeModal.vue
│   │   ├── SearchModal.vue              ⭐ new — ⌘K search across reports + guides
│   │   └── FlaggedAccountsList.vue      ⭐ new — homepage flagged-accounts table
│   │
│   ├── composables/
│   │   └── useTheme.ts
│   │
│   ├── data/
│   │   └── guides.ts                    ⭐ new — safety guide entries (title, slug, content, category)
│   │
│   ├── layouts/
│   │   └── default.vue                  (site-header, mobile menu, mega-menus, theme toggle)
│   │
│   ├── pages/
│   │   ├── index.vue                    → /
│   │   ├── about.vue                    → /about
│   │   ├── how-it-works.vue             → /how-it-works
│   │   ├── faq.vue                      → /faq
│   │   ├── contact.vue                  → /contact
│   │   ├── most-flagged.vue             ⭐ new → /most-flagged
│   │   │
│   │   ├── guides/
│   │   │   ├── index.vue                → /guides
│   │   │   └── [slug].vue               ⭐ new → /guides/:slug (custom Markdown renderer)
│   │   │
│   │   ├── reports/
│   │   │   ├── index.vue                → /reports
│   │   │   └── [id]/
│   │   │       ├── index.vue            → /reports/:id  (shows additionalReports, badges, recovery CTA)
│   │   │       └── edit.vue             → /reports/:id/edit
│   │   │
│   │   └── report/
│   │       └── new.vue                  → /report/new
│   │
│   └── assets/
│       └── css/
│           └── main.css                 (theme variables, light/dark)
│
├── server/
│   ├── api/
│   │   ├── reports.get.ts               GET    /api/reports
│   │   ├── reports.post.ts              POST   /api/reports  (rate-limited, dedup + auto-escalation)
│   │   ├── subscribe.post.ts            POST   /api/subscribe  ⭐ rate-limited (scoped to 'subscribe' action)
│   │   ├── contact.post.ts              POST   /api/contact
│   │   └── reports/
│   │       └── [id]/
│   │           └── flag.post.ts         POST   /api/reports/:id/flag
│   │
│   └── utils/
│       ├── db.ts                        Firestore reads/writes, dedup + escalation logic
│       ├── firebase-admin.ts            Firebase Admin SDK init (server-only, never client-facing)
│       └── reportFingerprint.ts         ⭐ new — reporter fingerprint + IP hash (salted, anti-Sybil)
│
├── public/
│   ├── FRLOGO.png
│   ├── FRLOGO_round.png                 ⭐ new — circular favicon/header logo
│   ├── fraudmap.png
│   ├── reports.png / stay.png / about.png / legal.png / trusts.png / state.png / how.png / trusts.png
│   └── ... (other static assets)
│
├── shared/
│   └── types/
│       └── report.ts                    Report, NewReportInput, TargetType (⭐ needs reportCount, status, distinctReporterCount fields — confirm these are typed)
│
├── .env                                 ⭐ new — REPORT_SALT (used by reportFingerprint.ts)
│
├── firestore.rules                      ⭐ new — explicit deny-all for reports/report_flags/rate_limits/contact_messages/subscribers (Admin SDK bypasses these; rules just document intent)
│
└── nuxt.config.ts                       ⭐ updated — favicon link tag pointing to /FRLOGO_round.png