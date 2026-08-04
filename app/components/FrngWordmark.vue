<template>
  <div class="frng-wordmark" :class="{ 'frng-wordmark--block': block }">
    <span class="frng-wordmark__text">FRNG.</span>
  </div>
</template>

<script setup>
defineProps({
  // If true, renders as a full red block (like the reference image).
  // If false, renders as inline text-only wordmark (better for a footer row).
  block: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.frng-wordmark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
    background: var(--surface);
}

.frng-wordmark__text {
  font-family: var(--sans, 'Arial', sans-serif);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--accent, #d63447);
  text-transform: uppercase;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  white-space: nowrap;
  animation: frng-color-cycle-text 8s ease-in-out infinite;
}

/* Full block variant — matches the reference image: solid color
   background with white wordmark filling the space */
.frng-wordmark--block {
  width: 100%;
  padding: clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 3rem);
}

.frng-wordmark--block .frng-wordmark__text {
  font-size: clamp(4.5rem, 20vw, 12rem);
  animation: frng-color-cycle-text 8s ease-in-out infinite;
}

/* Text color cycles through accent-adjacent hues — used by both variants */
@keyframes frng-color-cycle-text {
  /* 0%   { color: #d63447; } */
  55%  {color: var(--surface); }
  60%  { color: #06e733; }
  /* 60% {color: #d68334;}
  75%  { color: #7a34d6; }
  100% { color: #d63447; } */ 
}

/* Respect users who've asked for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .frng-wordmark__text {
    animation: none;
  }
}
</style>