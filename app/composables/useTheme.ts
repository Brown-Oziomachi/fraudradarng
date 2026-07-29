// composables/useTheme.ts
export function useTheme() {
  const theme = useState<'light' | 'green'>('theme', () => 'light')

  function applyTheme(value: 'light' | 'green') {
    theme.value = value
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', value)
      localStorage.setItem('theme', value)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'green' : 'light')
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as 'light' | 'green' | null
      const preferred = saved ?? (window.matchMedia('(prefers-color-scheme: green)').matches ? 'green' : 'light')
      applyTheme(preferred)
    }
  }

  return { theme, toggleTheme, initTheme }
}