<script setup>
/**
 * <FollowFrng />
 * Drop into any page: <FollowFrng />
 * Put your illustration in /public (e.g. /images/follow-illustration.svg or .png)
 * and set the `illustration` prop, or just edit the default below.
 */

const props = defineProps({
  illustration: {
    type: String,
    default: '/FRLOGO.png', // <- your file in /public
  },
  hashtag: {
    type: String,
    default: '#StopScamsNG',
  },
  handles: {
    type: Object,
    default: () => ({
      instagram: '@fraudradarng',
      twitter: '@fraudradarng',
      facebook: '@fraudradarng',
      linkedin: '@fraudradarng',
      youtube: '@fraudradarng',
      tiktok: '@fraudradarng',
    }),
  },
})

const platforms = computed(() => [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: props.handles.instagram,
    href: `https://instagram.com/${props.handles.instagram.replace('@', '')}`,
    bg: 'linear-gradient(135deg, #f0298c, #8a3ab9)',
  },
  {
    id: 'twitter',
    label: 'Twitter (X)',
    handle: props.handles.twitter,
    href: `https://x.com/${props.handles.twitter.replace('@', '')}`,
    bg: '#3b82f6',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: props.handles.facebook,
    href: `https://facebook.com/${props.handles.facebook.replace('@', '')}`,
    bg: '#2947d1',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: props.handles.linkedin,
    href: `https://linkedin.com/company/${props.handles.linkedin.replace('@', '')}`,
    bg: '#1f4fc9',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: props.handles.youtube,
    href: `https://youtube.com/${props.handles.youtube.replace('@', '')}`,
    bg: '#e02323',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: props.handles.tiktok,
    href: `https://tiktok.com/${props.handles.tiktok.replace('@', '')}`,
    bg: '#0a0a0a',
  },
])
</script>

<template>
  <section class="follow" aria-labelledby="follow-heading">
    <div class="follow-inner">
      <div class="follow-text">
        <h2 id="follow-heading">Follow FRNG</h2>
        <p>
          Follow and engage with us to stay updated and help spread the word.
          Let's make <strong class="tag">{{ hashtag }}</strong> reach every Nigerian, one
          feed at a time. 🤝
        </p>

        <ul class="grid">
          <li v-for="p in platforms" :key="p.id">
            <a
              :href="p.href"
              target="_blank"
              rel="noopener noreferrer"
              class="card"
              :style="{ background: p.bg }"
            >
              <span class="icon" v-html="icons[p.id]" />
              <span class="label">{{ p.label }}</span>
              <span class="handle">{{ p.handle }}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="follow-art" aria-hidden="true">
        <img
          v-if="illustration"
          :src="illustration"
          alt=""
          class="illustration"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script>
// Inline icon set — no external icon package required.
const icons = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 3H21l-7.4 8.46L22 21h-6.24l-4.9-6.4L4.9 21H1.4l7.9-9.03L2 3h6.4l4.43 5.86L17.53 3Zm-1.1 16.17h1.73L7.66 4.73H5.8l10.63 14.44Z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.9h2.66l.4-3.1h-3.06V8.1c0-.9.25-1.5 1.55-1.5H16.7V3.8c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.4-3.9 4v2.32H8v3.1h2.46V21h3.04Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-6.06c0-1.44-.03-3.3-2.02-3.3-2.02 0-2.33 1.58-2.33 3.2V20H9.36V8.5h3.24v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.06 2.26 4.06 5.2V20Z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.4a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.4 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .4 4.6 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.4-4.6ZM10 15V9l5.2 3-5.2 3Z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3h-3.1v12.4a2.6 2.6 0 1 1-2.1-2.55v-3.1a5.7 5.7 0 1 0 5.2 5.66V9.1a6.7 6.7 0 0 0 3.9 1.25V7.24A3.9 3.9 0 0 1 16.6 3Z"/></svg>`,
}
export default { data: () => ({ icons }) }
</script>

<style scoped>
.follow {
  background: var(--bg);
  padding: 72px clamp(20px, 5vw, 64px);
}

.follow-inner {
  display: grid;
  grid-template-columns: minmax(0, 560px) 1fr;
  align-items: center;
  gap: 48px;
  max-width: 1240px;
  margin: 0 auto;
}
@media (max-width: 900px) {
  .follow-inner {
    grid-template-columns: 1fr;
  }
  .follow-art {
    order: -1;
  }
}

.follow-text h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 14px;
  letter-spacing: -0.01em;
}

.follow-text p {
  color: var(--text-2);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 28px;
  max-width: 46ch;
}
.tag {
  color: var(--accent);
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 22px 12px;
  border-radius: 16px;
  color: #fff;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
}
.card:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.icon {
  width: 26px;
  height: 26px;
}
.icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.label {
  font-weight: 700;
  font-size: 14px;
}
.handle {
  font-size: 12px;
  opacity: 0.9;
}

.follow-art {
  display: flex;
  justify-content: center;
}
.illustration {
  width: 100%;
  max-width: 460px;
  height: auto;
  display: block;
}
</style>