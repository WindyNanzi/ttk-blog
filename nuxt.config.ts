// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  extends:['@nuxt-themes/docus'], // 使用 docus 主题
  app: {
    head: {
      meta:[
        { name: 'referrer', content: 'no-referrer' }
      ]
    }
  }
})
