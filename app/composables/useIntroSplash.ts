// app/composables/useIntroSplash.ts
export function useIntroSplash() {
  return useState<boolean>('intro-splash-active', () => true)
}