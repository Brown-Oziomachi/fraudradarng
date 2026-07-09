<script setup lang="ts">
import { guides } from '~/data/guides'

const route = useRoute()
const slug = route.params.slug as string

const guide = computed(() => guides.find((g) => g.slug === slug))

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found' })
}

useSeoMeta({
  title: `${guide.value.title} — Fraud Radar NG`,
  ogTitle: `${guide.value.title} — Fraud Radar NG`,
  description: guide.value.preview,
  ogDescription: guide.value.preview,
  ogImage: guide.value.image,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: guide.value.title,
  twitterDescription: guide.value.preview,
  twitterImage: guide.value.image,
})

/* ---------- Markdown → HTML renderer ---------- */

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineFormat(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)\*(?!\*)/g, '<em>$1</em>')
}

function isShoutLine(line: string) {
  const letters = line.replace(/[^A-Za-z]/g, '')
  if (letters.length < 12) return false
  return letters === letters.toUpperCase()
}

function parseTableRow(row: string) {
  return row
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

function renderTable(rows: string[]) {
  if (rows.length < 2) return ''
  const header = parseTableRow(rows[0] ?? '')
  const body = rows.slice(2) // skip the |---|---| separator row

  let out = '<div class="md-table-wrap"><table class="md-table"><thead><tr>'
  header.forEach((h) => {
    out += `<th>${inlineFormat(escapeHtml(h))}</th>`
  })
  out += '</tr></thead><tbody>'
  body.forEach((r) => {
    const cells = parseTableRow(r)
    out += '<tr>'
    cells.forEach((c) => {
      out += `<td>${inlineFormat(escapeHtml(c))}</td>`
    })
    out += '</tr>'
  })
  out += '</tbody></table></div>'
  return out
}

function renderMarkdown(content: string) {
  const lines = content.split('\n')
  let html = ''
  let inList: 'ul' | 'ol' | null = null
  let inBlockquote = false
  let inTable = false
  let tableRows: string[] = []

  const closeList = () => {
    if (inList) {
      html += inList === 'ul' ? '</ul>' : '</ol>'
      inList = null
    }
  }
  const closeBlockquote = () => {
    if (inBlockquote) {
      html += '</blockquote>'
      inBlockquote = false
    }
  }
  const closeTable = () => {
    if (inTable) {
      html += renderTable(tableRows)
      tableRows = []
      inTable = false
    }
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) {
      closeList()
      closeBlockquote()
      closeTable()
      continue
    }

    // Table rows
    if (/^\|.*\|$/.test(line)) {
      closeList()
      closeBlockquote()
      inTable = true
      tableRows.push(line)
      continue
    } else {
      closeTable()
    }

    let m: RegExpMatchArray | null

    // Headings
    if ((m = line.match(/^###\s+(.*)/))) {
      closeList(); closeBlockquote()
      html += `<h3 class="md-h3">${inlineFormat(escapeHtml(m[1] ?? ''))}</h3>`
      continue
    }
    if ((m = line.match(/^##\s+(.*)/))) {
      closeList(); closeBlockquote()
      html += `<h2 class="md-h2">${inlineFormat(escapeHtml(m[1] ?? ''))}</h2>`
      continue
    }
    if ((m = line.match(/^#\s+(.*)/))) {
      closeList(); closeBlockquote()
      html += `<h2 class="md-h2">${inlineFormat(escapeHtml(m[1] ?? ''))}</h2>`
      continue
    }


    // Horizontal rule
    if (/^-{3,}$/.test(line) || /^_{3,}$/.test(line)) {
      closeList(); closeBlockquote()
      html += '<hr class="md-hr" />'
      continue
    }

    // Blockquote
    if ((m = line.match(/^>\s*(.*)/))) {
      closeList()
      if (!inBlockquote) {
        html += '<blockquote class="md-quote">'
        inBlockquote = true
      }
      html += `<p>${inlineFormat(escapeHtml(m[1] ?? ''))}</p>`
      continue
    } else {
      closeBlockquote()
    }

    // Unordered list
    if ((m = line.match(/^[-*]\s+(.*)/))) {
      if (inList !== 'ul') {
        closeList()
        html += '<ul class="md-ul">'
        inList = 'ul'
      }
      html += `<li>${inlineFormat(escapeHtml(m[1] ?? ''))}</li>`
      continue
    }

    // Ordered list
    if ((m = line.match(/^(\d+)\.\s+(.*)/))) {
      if (inList !== 'ol') {
        closeList()
        html += '<ol class="md-ol">'
        inList = 'ol'
      }
      html += `<li>${inlineFormat(escapeHtml(m[2] || ''))}</li>`
      continue
    }

    closeList()

    // All-caps emphasis line -> styled callout box
    if (isShoutLine(line)) {
      html += `<p class="md-callout">${inlineFormat(escapeHtml(line))}</p>`
      continue
    }

    html += `<p class="md-p">${inlineFormat(escapeHtml(line))}</p>`
  }

  closeList()
  closeBlockquote()
  closeTable()
  return html
}

const renderedContent = computed(() =>
  guide.value ? renderMarkdown(guide.value.content) : ''
)

function getReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(' ').length / 200))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const otherGuides = computed(() =>
  guides.filter((g) => g.slug !== slug).slice(0, 4)
)

/* ---------- Sidebar: cross-links to the rest of the site ---------- */

const siteLinks = [
  {
    to: '/reports',
    label: 'Scam Checker',
    desc: 'Check a number, link, or account before you trust it.',
    icon: 'M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z',
  },
  {
    to: '/report/new',
    label: 'File a Report',
    desc: 'Warn others about a scam you experienced.',
    icon: 'M12 9v4m0 4h.01M4.93 4.93l14.14 14.14',
  },
  {
    to: '/guides',
    label: 'All Guides',
    desc: 'Browse the full safety library.',
    icon: 'M4 6h16M4 12h16M4 18h7',
  },
  {
    to: '/help',
    label: 'Get Help',
    desc: 'EFCC, NPF-NCCC, and CBN contacts.',
    icon: 'M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z',
  },
]
</script>

<template>
  <div v-if="guide" class="page-shell">
    <NuxtLink to="/guides" class="back-link">← All guides</NuxtLink>

    <div class="layout-grid">
      <!-- ---------- Main column ---------- -->
      <div class="main-col">
        <div class="article-header">
          <div class="header-top-row">
            <span class="guide-tag">{{ guide.category }}</span>
            <span class="verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              Verified Safety Resource
            </span>
          </div>
          <h1 class="article-title">{{ guide.title }}</h1>
          <div class="article-meta">
            <span>Fraud Radar NG</span>
            <span class="meta-dot" />
            <span>{{ getReadingTime(guide.content) }} min read</span>
            <span class="meta-dot" />
            <span>{{ formatDate(guide.datePublished) }}</span>
          </div>
        </div>

        <div class="article-image-wrap">
          <img :src="guide.image" :alt="guide.title" class="article-image" />
        </div>

        <div class="article-body md-content" v-html="renderedContent" />

        <div class="cta-strip">
          <h3 class="cta-title">Seen this exact pattern happen to you?</h3>
          <p class="cta-sub">File a report so the next person sees the warning before they lose anything.</p>
          <NuxtLink to="/report/new" class="btn btn--accent">Report a scam</NuxtLink>
        </div>
      </div>

      <!-- ---------- Sidebar ---------- -->
      <aside class="side-col">
        <div v-if="otherGuides.length" class="side-card">
          <h3 class="side-heading">More Guides</h3>
          <div class="side-guide-list">
            <NuxtLink
              v-for="g in otherGuides"
              :key="g.slug"
              :to="`/guides/${g.slug}`"
              class="side-guide-item"
            >
              <img :src="g.image" :alt="g.title" class="side-guide-thumb" loading="lazy" />
              <div class="side-guide-text">
                <span class="guide-tag guide-tag--sm">{{ g.category }}</span>
                <span class="side-guide-title">{{ g.title }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="side-card">
          <h3 class="side-heading">Explore Fraud Radar NG</h3>
          <div class="side-link-list">
            <NuxtLink
              v-for="link in siteLinks"
              :key="link.to"
              :to="link.to"
              class="side-link-item"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="side-link-icon">
                <path :d="link.icon" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="side-link-text">
                <span class="side-link-label">{{ link.label }}</span>
                <span class="side-link-desc">{{ link.desc }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="side-card side-cta">
          <p class="side-cta-text">Spotted a scam recently?</p>
          <NuxtLink to="/report/new" class="btn btn--accent btn--full">Report it</NuxtLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 1040px;
  margin: 0 auto;
  padding: 56px 24px 100px;
}

.back-link {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  text-decoration: none;
  margin-bottom: 28px;
}
.back-link:hover { color: var(--accent); }

/* ---------- Layout grid ---------- */

.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  align-items: start;
}

@media (min-width: 960px) {
  .layout-grid {
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 56px;
  }
}

.main-col {
  min-width: 0;
}

.header-top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.guide-tag {
  display: inline-block;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  background: var(--accent-dim, rgba(232,255,71,0.08));
  color: var(--accent);
  border: 1px solid rgba(232,255,71,0.2);
}

.guide-tag--sm {
  font-size: 8px;
  padding: 2px 6px;
  margin-bottom: 6px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 3px;
  background: rgba(120, 200, 160, 0.08);
  color: #7fd8a8;
  border: 1px solid rgba(120, 200, 160, 0.25);
}

.article-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.6vw, 36px);
  color: var(--text-1);
  line-height: 1.25;
  margin-bottom: 14px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
  margin-bottom: 32px;
}
.meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--border-hi); }

.article-image-wrap {
  width: 100%;
  height: 340px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  margin-bottom: 40px;
}
.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-body {
  display: flex;
  flex-direction: column;
}

/* ---------- Rendered Markdown styling ---------- */

:deep(.md-p) {
  font-size: 15.5px;
  color: var(--text-2);
  line-height: 1.85;
  font-weight: 300;
  margin-bottom: 20px;
}

:deep(.md-h2) {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
  line-height: 1.35;
  margin: 40px 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

:deep(.md-h3) {
  font-family: var(--serif);
  font-size: 17.5px;
  color: var(--accent);
  line-height: 1.4;
  margin: 32px 0 14px;
}

:deep(.md-content strong) {
  color: var(--text-1);
  font-weight: 700;
}

:deep(.md-content em) {
  color: var(--text-1);
  font-style: normal;
  text-decoration: underline;
  text-decoration-color: rgba(232,255,71,0.5);
  text-underline-offset: 3px;
}

:deep(.md-ul),
:deep(.md-ol) {
  margin: 0 0 22px;
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
:deep(.md-ul) { list-style: none; padding-left: 4px; }
:deep(.md-ul li) {
  position: relative;
  padding-left: 20px;
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
}
:deep(.md-ul li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
:deep(.md-ol li) {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  padding-left: 6px;
}
:deep(.md-ol) { list-style: decimal; }
:deep(.md-ol li)::marker {
  color: var(--accent);
  font-family: var(--mono);
  font-weight: 700;
}

:deep(.md-quote) {
  margin: 24px 0;
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  background: var(--surface);
}
:deep(.md-quote p) {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.75;
  font-style: italic;
  margin: 0;
}

:deep(.md-callout) {
  margin: 24px 0;
  padding: 16px 18px;
  border: 1px solid rgba(232,255,71,0.3);
  border-radius: var(--radius);
  background: var(--accent-dim, rgba(232,255,71,0.06));
  color: var(--text-1);
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.02em;
  line-height: 1.7;
  font-weight: 600;
  text-underline-offset: 3px;
}

:deep(.md-hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 36px 0;
}

:deep(.md-table-wrap) {
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
:deep(.md-table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
:deep(.md-table th) {
  text-align: left;
  padding: 10px 14px;
  background: var(--surface);
  color: var(--text-1);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
}
:deep(.md-table td) {
  padding: 10px 14px;
  color: var(--text-2);
  border-bottom: 1px solid var(--border);
  font-weight: 300;
}
:deep(.md-table tr:last-child td) { border-bottom: none; }

.cta-strip {
  margin-top: 56px;
  padding: 32px;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  background: var(--surface);
}
.cta-title {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  margin-bottom: 8px;
}
.cta-sub {
  font-size: 13px;
  color: var(--text-3);
  font-weight: 300;
  margin-bottom: 20px;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; font-family: var(--mono);
  font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
  padding: 12px 24px; border-radius: var(--radius); border: none;
  text-decoration: none;
}
.btn--accent { background: var(--accent); color: #0a0a0b; }
.btn--accent:hover { background: #d4eb3c; }
.btn--full { width: 100%; }

/* ---------- Sidebar ---------- */

.side-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 960px) {
  .side-col {
    position: sticky;
    top: 24px;
  }
}

.side-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  background: var(--surface);
}

.side-heading {
  font-family: var(--serif);
  font-size: 14.5px;
  color: var(--text-1);
  margin-bottom: 16px;
  margin-top: 40px;
}

.side-guide-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.side-guide-item {
  display: flex;
  gap: 10px;
  text-decoration: none;
}

.side-guide-thumb {
  width: 56px;
  height: 56px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--surface);
}

.side-guide-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-guide-title {
  font-family: var(--serif);
  font-size: 13px;
  color: var(--text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.side-guide-item:hover .side-guide-title { color: var(--accent); }

.side-link-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-link-item {
  display: flex;
  gap: 10px;
  text-decoration: none;
  align-items: flex-start;
}

.side-link-icon {
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.side-link-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.side-link-label {
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-1);
}
.side-link-item:hover .side-link-label { color: var(--accent); }

.side-link-desc {
  font-size: 12px;
  color: var(--text-3);
  line-height: 1.5;
  font-weight: 300;
}

.side-cta {
  text-align: center;
}

.side-cta-text {
  font-family: var(--serif);
  font-size: 14px;
  color: var(--text-1);
  margin-bottom: 14px;
}
</style>