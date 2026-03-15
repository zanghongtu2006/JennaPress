<script setup lang="ts">
const props = defineProps<{
  themes?: string[]
  defaultTheme?: string
}>()

const { theme, themes, setTheme } = useTheme({
  themes: props.themes,
  defaultTheme: props.defaultTheme
})

const selectedTheme = computed({
  get: () => theme.value,
  set: (value: string) => setTheme(value)
})
</script>

<template>
  <div v-if="themes.length > 1" class="theme-select">
    <div class="theme-select-wrap">
      <select
        id="saas-theme-select"
        v-model="selectedTheme"
        class="theme-select-control"
      >
        <option v-for="item in themes" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
  </div>
</template>