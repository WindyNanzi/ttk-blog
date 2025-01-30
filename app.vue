<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  title: 'My Blog',
  meta: [
    {
      name: 'referrer',
      content: 'never'
    }
  ]
})
</script>

<style>
/* 清除页面四周的间隙 */
body {
  margin: 0;
  padding: 0;
}
</style>