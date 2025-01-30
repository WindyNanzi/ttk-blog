<template>
  <nav class="navbar">
    <div class="navbar-content">
      <NuxtLink to="/" class="logo">My Blog</NuxtLink>
      <div class="nav-buttons">
        <NuxtLink to="/posts" class="nav-button">博客</NuxtLink>
        <button @click="toggleTheme" class="theme-toggle">
          <Icon :name="isDark ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off'" size="24" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

.nav-buttons {
  display: flex;
  align-items: center;
}

.nav-button {
  margin-right: 20px;
  text-decoration: none;
  color: #333;
  font-size: 18px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
}
</style>