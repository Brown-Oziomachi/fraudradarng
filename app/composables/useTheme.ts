// composables/useTheme.ts
export function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  function applyTheme(value: 'light' | 'dark') {
    theme.value = value
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', value)
      localStorage.setItem('theme', value)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
      const preferred = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      applyTheme(preferred)
    }
  }

  return { theme, toggleTheme, initTheme }
}