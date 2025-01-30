// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content', // 启用 @nuxt/content 模块
  ],
  content: {
    // 配置内容模块选项
    documentDriven: true // 如果需要文档驱动模式
  },
})
