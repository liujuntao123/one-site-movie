// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@ant-design-vue/nuxt'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta:[
        {name:'referrer',content:'no-referrer'},
        {'http-equiv':'Content-Security-Policy',content:"worker-src blob:; child-src blob: gap:;img-src * blob: data:;media-src * blob:;default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:"}
      ]
    }
  }
})