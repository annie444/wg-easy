// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    server: process.env.OIDC_SERVER || undefined, // Authorization server's Issuer Identifier URL
    clientId: process.env.OIDC_CLIENT_ID || undefined, // Client identifier at the Authorization Server
    clientSecret: process.env.OIDC_CLIENT_SECRET || undefined, // Client Secret
    scope: process.env.OIDC_SCOPES || 'openid email',
    redirect_uri: process.env.OIDC_REDIRECT_URI || undefined, // Redirect URI
    public: {
      oidcProvider: process.env.OIDC_PROVIDER || undefined,
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@eschricht/nuxt-color-mode',
    'radix-vue/nuxt',
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    cookieName: 'theme',
  },
  i18n: {
    // https://i18n.nuxtjs.org/docs/guide/server-side-translations
    experimental: {
      localeDetector: './localeDetector.ts',
    },
  },
  nitro: {
    esbuild: {
      options: {
        target: 'es2020',
      },
    },
  },
});
