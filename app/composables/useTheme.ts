// composables/useTheme.ts
export function useTheme() {
  const theme = useState<'green' | 'light'>('theme', () => 'green')

  function applyTheme(value: 'green' | 'light') {
    theme.value = value
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', value)
      localStorage.setItem('theme', value)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'green' ? 'light' : 'green')
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as 'green' | 'light' | null
      const preferred = saved ?? (window.matchMedia('(prefers-color-scheme: green)').matches ? 'light' : 'green')
      applyTheme(preferred)
    }
  }

  return { theme, toggleTheme, initTheme }
}