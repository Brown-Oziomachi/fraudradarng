<!-- app.vue -->
<script setup lang="ts">
const introActive = useIntroSplash()
</script>

<template>
  <div>
    <IntroSplash />
    <div class="site-content" :class="{ 'site-content--hidden': introActive }" :aria-hidden="introActive"
      :inert="introActive">
      <NuxtLayout>
        <DisclaimerModal />
        <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
.site-content {
  opacity: 1;
  transition: opacity 0.4s ease;
}

.site-content--hidden {
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .site-content {
    transition: none;
  }
}
</style>