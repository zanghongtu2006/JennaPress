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
  <div v-if="themes.length > 1" class="theme-select">
    <div class="theme-select-wrap">
      <select
        id="saas-theme-select"
        class="theme-select-control"
        :value="theme"
        @change="setTheme(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="item in themes" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>  
  </div>
</template>
