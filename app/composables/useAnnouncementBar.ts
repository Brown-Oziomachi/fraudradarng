// composables/useAnnouncementBar.ts

import { ref } from 'vue'

const isAnnouncementVisible = ref(false)
export const ANNOUNCEMENT_BAR_HEIGHT = 34 // px — keep in sync with AnnouncementBar.vue

export function useAnnouncementBar() {
  return { isAnnouncementVisible }
}