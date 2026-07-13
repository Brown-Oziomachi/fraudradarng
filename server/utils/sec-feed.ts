import { XMLParser } from 'fast-xml-parser'

const FEED_URL = 'https://home.sec.gov.ng/feeds/enforcement-updates.rss'
const FEED_ORIGIN = 'https://home.sec.gov.ng'

export interface FeedItem {
  guid: string
  title: string
  link: string
  pubDate: string | null
  summary: string
}

function extractText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && '#text' in (value as any)) {
    return String((value as any)['#text'])
  }
  return ''
}

// SEC's <description> field contains their CMS's rich-text block markup
// (<div class="block-paragraph_block"><p data-block-key="...">...) rather
// than plain text. Strip tags, collapse whitespace, decode the handful of
// HTML entities their editor commonly emits, and cap length for display.
function stripHtml(raw: string): string {
  const withoutTags = raw.replace(/<[^>]*>/g, ' ')
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  const collapsed = decoded.replace(/\s+/g, ' ').trim()
  const MAX_LENGTH = 400
  return collapsed.length > MAX_LENGTH
    ? collapsed.slice(0, MAX_LENGTH).trimEnd() + '…'
    : collapsed
}

// The feed's <link> is sometimes a path relative to home.sec.gov.ng rather
// than a full URL — resolving it against the wrong origin sends people to
// our own domain instead of SEC's. Always resolve against the feed's origin.
function normalizeLink(rawLink: string): string {
  if (!rawLink) return FEED_ORIGIN
  try {
    return new URL(rawLink, FEED_ORIGIN).toString()
  } catch {
    return FEED_ORIGIN
  }
}

export async function fetchSecFeed(): Promise<FeedItem[]> {
  const xml = await $fetch<string>(FEED_URL, { responseType: 'text' })

  const parser = new XMLParser({ ignoreAttributes: false })
  const parsed = parser.parse(xml)

  const rawItems = parsed?.rss?.channel?.item
  if (!rawItems) return []

  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  return items.map((item: any): FeedItem => {
    const rawLink = extractText(item.link)
    const guid = extractText(item.guid) || rawLink || String(item.title ?? '')
    return {
      guid,
      title: stripHtml(extractText(item.title) || 'Untitled enforcement update'),
      link: normalizeLink(rawLink),
      pubDate: extractText(item.pubDate) || null,
      summary: stripHtml(extractText(item.description) || ''),
    }
  })
}