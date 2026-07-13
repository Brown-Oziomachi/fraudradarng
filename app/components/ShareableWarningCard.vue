<!-- components/ShareableWarningCard.vue -->
<script setup lang="ts">
import type { Report } from '~/types/report'

// Local copy of ScamCategory keys used by this component.
// The upstream types/report does not export ScamCategory, so define here.
type ScamCategory = 'fintech_ussd' | 'social_commerce' | 'visa_travel' | 'job_ponzi' | 'other'

const props = defineProps<{
  report: Report
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const generatedUrl = ref<string | null>(null)
const generating = ref(false)

const CATEGORY_LABELS: Record<ScamCategory, string> = {
  fintech_ussd: 'Fintech & USSD Fraud',
  social_commerce: 'Social Commerce Scam',
  visa_travel: 'Visa & Travel Fraud',
  job_ponzi: 'Job & Ponzi Scheme',
  other: 'Reported Scam'
}

function maskAccountNumber(num?: string): string {
  if (!num || num.length < 7) return num ?? '—'
  return `${num.slice(0, 3)}***${num.slice(-4)}`
}

function getEntityLabel(report: Report): string {
  if ((report as any).targetType === 'bank_account') {
    return `${report.bankName ?? 'Bank'} (${maskAccountNumber(report.accountNumber)})`
  }
  if ((report as any).targetType === 'company') {
    return (report as any).companyName ?? 'Unknown Company'
  }
  if ((report as any).targetType === 'website') {
    return (report as any).websiteUrl || 'Unknown Website'
  }
  return 'Unknown Entity'
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ')
  let line = ''
  let curY = y
  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, curY)
      line = word + ' '
      curY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, curY)
  return curY + lineHeight
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function generateCard() {
  generating.value = true
  await nextTick()

  const canvas = canvasRef.value
  if (!canvas) { generating.value = false; return }
  const ctx = canvas.getContext('2d')
  if (!ctx) { generating.value = false; return }

  const W = 1080
  const H = 1080
  canvas.width = W
  canvas.height = H

  const RED = '#d81e2c'
  const DARK = '#141414'
  const GREY = '#5a5a5a'

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Top red band — headline
  const bandHeight = 240
  ctx.fillStyle = RED
  ctx.fillRect(0, 0, W, bandHeight)

  // Logo (top-left of the red band)
  let logo: HTMLImageElement | null = null
  try {
    logo = await loadImage('/FRLOGO.png') // ← update this path to your actual logo file
  } catch {
    logo = null // silently fall back to no logo if it fails to load
  }

  if (logo) {
    const logoSize = 72
    ctx.drawImage(logo, 40, 40, logoSize, logoSize)
  }

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 58px system-ui, -apple-system, "Segoe UI", Arial, sans-serif'
  ctx.fillText(logo ? 'FRAUD RADAR NG' : '🚨 FRAUD RADAR NG', W / 2, 110)
  ctx.font = '700 40px system-ui, Arial, sans-serif'
  ctx.fillText('ALERT', W / 2, 170)

  // Watermark logo — dim, centered in the white body area, sits behind the text
  if (logo) {
    const wmSize = 512
    const wmX = (W - wmSize) / 2
    const wmY = bandHeight + (H - bandHeight - wmSize) / 2

    ctx.save()
    ctx.globalAlpha = 0.10
    ctx.drawImage(logo, wmX, wmY, wmSize, wmSize)
    ctx.restore()
  }

  // Body
  const marginX = 80
  let y = bandHeight + 110
  ctx.textAlign = 'left'

  ctx.fillStyle = GREY
  ctx.font = '700 30px system-ui, Arial, sans-serif'
  ctx.fillText('FLAGGED ENTITY', marginX, y)
  y += 55

  ctx.fillStyle = DARK
  ctx.font = '800 50px system-ui, Arial, sans-serif'
  y = wrapText(ctx, getEntityLabel(props.report), marginX, y, W - marginX * 2, 58)
  y += 50

  ctx.fillStyle = RED
  ctx.font = '700 30px system-ui, Arial, sans-serif'
  ctx.fillText('SCAM TYPE', marginX, y)
  y += 55

  ctx.fillStyle = DARK
  ctx.font = '600 40px system-ui, Arial, sans-serif'
  // props.report may be typed without 'category' on Report; cast to any to safely access
  const categoryLabel = CATEGORY_LABELS[(((props.report as any)?.category) ?? 'other') as keyof typeof CATEGORY_LABELS]
  y = wrapText(ctx, categoryLabel, marginX, y, W - marginX * 2, 48)
  y += 40

  // Divider
  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(marginX, y)
  ctx.lineTo(W - marginX, y)
  ctx.stroke()
  y += 55

  ctx.fillStyle = GREY
  ctx.font = '400 30px system-ui, Arial, sans-serif'
  wrapText(ctx, 'Check numbers, accounts, and companies before you transact at fraudradar.ng.', marginX, y, W - marginX * 2, 40)

  // Bottom red CTA band
  const ctaHeight = 150
  ctx.fillStyle = RED
  ctx.fillRect(0, H - ctaHeight, W, ctaHeight)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 46px system-ui, Arial, sans-serif'
  ctx.fillText('fraudradar.ng', W / 2, H - ctaHeight / 2 + 10)
  ctx.font = '500 24px system-ui, Arial, sans-serif'
  ctx.fillText('Report. Verify. Protect your money.', W / 2, H - ctaHeight / 2 + 50)

  canvas.toBlob((blob) => {
    if (blob) {
      if (generatedUrl.value) URL.revokeObjectURL(generatedUrl.value)
      generatedUrl.value = URL.createObjectURL(blob)
    }
    generating.value = false
  }, 'image/png')
}

async function downloadCard() {
  if (!generatedUrl.value) await generateCard()
  if (!generatedUrl.value) return
  const a = document.createElement('a')
  a.href = generatedUrl.value
  a.download = `fraud-radar-alert-${props.report.id}.png`
  a.click()
}

async function shareCard() {
  if (!generatedUrl.value) await generateCard()
  if (!generatedUrl.value) return

  try {
    const res = await fetch(generatedUrl.value)
    const blob = await res.blob()
    const file = new File([blob], 'fraud-radar-alert.png', { type: 'image/png' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Fraud Radar NG Alert',
        text: 'Check this flagged entity before you transact — via fraudradar.ng'
      })
      return
    }
  } catch (err) {
    // user cancelled share sheet or share failed — fall through to download
  }
  downloadCard()
}

onMounted(() => {
  generateCard()
})

onUnmounted(() => {
  if (generatedUrl.value) URL.revokeObjectURL(generatedUrl.value)
})
</script>

<template>
  <div class="warning-card">
    <canvas ref="canvasRef" class="hidden-canvas" />

    <div class="preview-wrap">
      <div v-if="generating" class="preview-loading">Generating alert…</div>
      <img v-else-if="generatedUrl" :src="generatedUrl" alt="Fraud Radar NG warning card preview" class="preview-image" />
    </div>

    <div class="actions">
      <button class="btn-share" :disabled="generating" @click="shareCard">
        Share to WhatsApp
      </button>
      <button class="btn-download" :disabled="generating" @click="downloadCard">
        Download image
      </button>
    </div>
  </div>
</template>

<style scoped>
.warning-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.hidden-canvas {
  display: none;
}

.preview-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border-radius: var(--radius);
  overflow: hidden;
  background: #fff;
}

.preview-image {
  width: 100%;
  max-width: 320px;
  display: block;
  border-radius: var(--radius);
}

.preview-loading {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
}

.actions {
  display: flex;
  flex-direction: column;   /* was: no direction set (defaults to row) */
  gap: 10px;
}

.btn-share, .btn-download {
  width: 100%;              /* was: flex: 1 + min-width: 140px, which let them share a row */
  font-family: var(--mono);
  font-size: 12.5px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: var(--radius);
  cursor: pointer;
  border: none;
}

.btn-share {
  background: #25D366; /* WhatsApp green — intentional, not your app's accent */
  color: #0a0a0b;
}
.btn-share:hover { background: #1ebc59; }

.btn-download {
  background: none;
  border: 1px solid var(--border-hi);
  color: var(--text-2);
}
.btn-download:hover { border-color: var(--accent); color: var(--text-1); }

.btn-share:disabled, .btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>