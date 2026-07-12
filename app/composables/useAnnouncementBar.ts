// composables/useAnnouncementBar.ts
//
// A single shared ref so `AnnouncementBar.vue` can tell the layout whether
// it's currently rendering. The mobile header is `position: fixed`, which
// takes it out of document flow — without this, a fixed header always
// sits at the very top and covers the bar above it.

import { ref } from 'vue'

const isAnnouncementVisible = ref(false)
export const ANNOUNCEMENT_BAR_HEIGHT = 34 // px — keep in sync with AnnouncementBar.vue

export function useAnnouncementBar() {
  return { isAnnouncementVisible }
}