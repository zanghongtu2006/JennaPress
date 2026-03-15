<script setup lang="ts">
const props = defineProps<{
  themes?: string[]
  defaultTheme?: string
}>()

const { theme, themes, setTheme } = useTheme({
  themes: props.themes,
  defaultTheme: props.defaultTheme
})
</script>

<template>
  <div v-if="themes.length > 1" class="theme-switcher" aria-label="Theme switcher">
    <button
      v-for="item in themes"
      :key="item"
      type="button"
      class="theme-switcher-button"
      :class="{ 'is-active': theme === item }"
      @click="setTheme(item)"
    >
      {{ item }}
    </button>
  </div>
</template>
