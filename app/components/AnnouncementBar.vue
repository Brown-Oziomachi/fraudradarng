<script setup lang="ts">
/**
 * components/AnnouncementBar.vue
 * Renders the site-wide scrolling announcement bar.
 * Reads live from Firestore doc: siteSettings/announcement
 * Add <AnnouncementBar /> at the very top of layouts/default.vue,
 * before <header>.
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { useFirebaseClient } from '~/composables/useFirebaseClient'
import { useAnnouncementBar } from '~/composables/useAnnouncementBar'

interface AnnouncementData {
  message: string
  label: string
  linkUrl: string
  linkText: string
  bgColor: string
  textColor: string
  active: boolean
}

const announcement = ref<AnnouncementData | null>(null)
const isPaused = ref(false)
const barRef = ref<HTMLElement | null>(null)

// Shared with the layout — lets the fixed mobile header know to offset
// itself by the bar's height instead of covering it.
const { isAnnouncementVisible: isVisible } = useAnnouncementBar()

function pauseScroll() {
  isPaused.value = true
}

// Only resume when the tap/click lands outside the bar — a tap on the bar
// itself (or its link) shouldn't immediately resume mid-read.
function handleDocumentPointerDown(e: PointerEvent) {
  if (barRef.value && !barRef.value.contains(e.target as Node)) {
    isPaused.value = false
  }
}

let unsub: (() => void) | null = null

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)

  // Firebase's client SDK must not run during SSR — this component can be
  // rendered server-side as part of the layout, and if this fires before
  // your client Firebase plugin has called initializeApp(), you'll get
  // "No Firebase App '[DEFAULT]' has been created".
  if (!import.meta.client) return

  const { db } = useFirebaseClient()
  const announcementRef = doc(db, 'siteSettings', 'announcement')
  unsub = onSnapshot(
    announcementRef,
    (snap) => {
      announcement.value = snap.exists() ? (snap.data() as AnnouncementData) : null
    },
    (err) => {
      console.error('AnnouncementBar: failed to load', err)
      announcement.value = null
    }
  )
})

onUnmounted(() => {
  unsub?.()
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  // Make sure the layout doesn't stay offset after this component unmounts
  // (e.g. during route/layout transitions).
  isVisible.value = false
})

watch(
  announcement,
  () => {
    isVisible.value = !!announcement.value?.active && !!announcement.value?.message?.trim()
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-if="isVisible"
    ref="barRef"
    class="announcement-bar"
    :style="{ background: announcement!.bgColor || '#0d2244' }"
    role="status"
    @touchstart="pauseScroll"
    @mousedown="pauseScroll"
  >
    <span class="announcement-tag">
      <span class="tag-dot" />
      {{ announcement!.label || 'NOTICE' }}
    </span>

    <div class="announcement-track">
      <div class="announcement-track-inner" :class="{ paused: isPaused }">
        <span
          v-for="n in 2"
          :key="n"
          class="announcement-text"
          :style="{ color: announcement!.textColor || '#f5f0e8' }"
          :aria-hidden="n === 2"
        >
          {{ announcement!.message }}
          <a
            v-if="announcement!.linkUrl"
            :href="announcement!.linkUrl"
            class="announcement-link"
          >
            {{ announcement!.linkText || 'Learn more →' }}
          </a>
          <span class="spacer">&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.announcement-bar {
  display: flex;
  align-items: center;
  height: 34px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 65;
}

.announcement-tag {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent, #e8ff47);
  color: #0b0d08;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 10px;
  margin: 0 16px;
  border-radius: 3px;
  white-space: nowrap;
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0b0d08;
  display: inline-block;
}

.announcement-track {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 24px,
    black calc(100% - 24px),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 24px,
    black calc(100% - 24px),
    transparent
  );
}

.announcement-track-inner {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-left 48s linear infinite;
}

.announcement-track-inner.paused {
  animation-play-state: paused;
}

.announcement-text {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
}

.announcement-link {
  font-weight: 700;
  margin-left: 12px;
  text-decoration: none;
  color: var(--accent, #e8ff47);
}

.announcement-link:hover {
  text-decoration: underline;
}

@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .announcement-track-inner {
    animation: none;
  }
  .announcement-track {
    overflow-x: auto;
  }
}
</style>