<template>
  <div class="container">
    <div class="sidebar">
      <ul>
        <li v-for="post in posts" :key="post._path" @click="selectPost(post._path)" :class="{ active: selectedPost === post._path }">
          <span>{{ post.title }}</span>
        </li>
      </ul>
    </div>
    <div class="content">
      <NuxtPage/>
    </div>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () => queryContent('posts').find())
const selectedPost = ref(posts.value[0]?._path)

const router = useRouter()
router.push({ path: selectedPost.value })
const selectPost = (path) => {
  selectedPost.value = path
  router.push({ path })
}
</script>

<style scoped>
.container {
  display: flex;
  height: calc(100vh - 60px); /* 60px is the height of the navbar */
}

.sidebar {
  width: 240px;
  background-color: #f4f4f4;
  overflow-y: auto;
  padding: 10px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar li.active {
  background-color: #ddd;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
  margin-left: 10px;
}
</style>