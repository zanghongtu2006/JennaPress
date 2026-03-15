import { computed, watch } from 'vue'

const STORAGE_KEY = 'site-theme'

type ThemeOptions = {
  themes?: string[]
  defaultTheme?: string
}

function normalizeThemes(themes: string[] | undefined, defaultTheme: string) {
  const normalized = Array.isArray(themes)
    ? themes.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
    : []

  return normalized.length ? normalized : [defaultTheme]
}

export function useTheme(options: ThemeOptions = {}) {
  const fallbackTheme = typeof options.defaultTheme === 'string' && options.defaultTheme.trim()
    ? options.defaultTheme.trim()
    : 'light'

  const themes = computed(() => normalizeThemes(options.themes, fallbackTheme))
  const defaultTheme = computed(() => themes.value.includes(fallbackTheme) ? fallbackTheme : themes.value[0])

  const themeState = useState<string>('site-theme', () => defaultTheme.value)
  const initialized = useState<boolean>('site-theme-initialized', () => false)
  const watchBound = useState<boolean>('site-theme-watch-bound', () => false)

  if (import.meta.client && !initialized.value) {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY)
    themeState.value = savedTheme && themes.value.includes(savedTheme) ? savedTheme : defaultTheme.value
    initialized.value = true
  }

  watch(themes, (currentThemes) => {
    if (!currentThemes.includes(themeState.value)) {
      themeState.value = defaultTheme.value
    }
  }, { immediate: true })

  if (import.meta.client && !watchBound.value) {
    watch(themeState, (value) => {
      window.localStorage.setItem(STORAGE_KEY, value)
    }, { immediate: true })
    watchBound.value = true
  }

  function setTheme(nextTheme: string) {
    if (themes.value.includes(nextTheme)) {
      themeState.value = nextTheme
    }
  }

  return {
    theme: computed(() => themes.value.includes(themeState.value) ? themeState.value : defaultTheme.value),
    themes,
    setTheme
  }
}
