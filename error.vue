<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()
</script>

<template>
  <div class="page-not-found">
    <div class="box">
      <h1>{{ error.statusCode || 500 }}</h1>
      <p>{{ error.statusMessage || error.message || 'Unexpected error' }}</p>
      <NuxtLink to="/" class="btn btn-primary">Back to Home</NuxtLink>
    </div>
  </div>
</template>
