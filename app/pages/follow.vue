<script setup>
definePageMeta({
    hideFooter: true,
})
useHead({
  title: 'Follow FRNG',
  meta: [
    {
      name: 'description',
      content: 'Follow Fraud Radar NG across social media and help spread the word.',
    },
  ],
})
</script>

<template>
  <div class="follow-page">
    <FollowFrng
      illustration="/follow.png"
      hashtag="#StopScamsNG"
      :handles="{
        instagram: '@fraudradarng',
        twitter: '@fraudradarng',
        facebook: '@fraudradarng',
        linkedin: '@fraudradarng',
        youtube: '@fraudradarng',
        tiktok: '@fraudradarng',
      }"
    />
  </div>
</template>

<style scoped>
.follow-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
}
</style>