<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <DisclaimerModal />
      <NuxtPage :page-key="route => route.fullPath" />
      </NuxtLayout>
  </div>
</template>

