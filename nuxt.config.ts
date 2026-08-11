export default defineNuxtConfig({
  ssr: process.env.NODE_ENV === 'production',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false }, 
  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: [
        'firebase/app',
        'firebase/auth',
        'firebase/firestore'
      ]
    }
  },

  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,

    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  },
  nitro: {
    externals: {
      inline: ['jose']
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/FRLOGO.png' },
      ],
      script: [
        {
          innerHTML: `
            (function() {
              try {
                var saved = localStorage.getItem('theme');
                var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            })();
          `,
          type: 'text/javascript'
        }
      ]
    }
  }
})