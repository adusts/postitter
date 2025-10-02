<script setup>
import { ref } from "vue";
import { usePosts } from "./composables/usePost.js";
import PostGrid from "./components/PostGrid.vue";
import PostForm from "./components/PostForm.vue";

const { posts, addPost, deletePost } = usePosts();

const selectedColor = ref("#f9faea");
const presetColors = ['#faf4e6', '#f5d7cd', '#eaf3ee', '#dde8e4', '#c6c5ca'];
</script>

<template>
  <main>
    <div class="container">
      <PostGrid :posts="posts" @delete="deletePost" />

      <PostForm
        :presetColors="presetColors"
        v-model:selectedColor="selectedColor"
        @submit="(text) => addPost(text, selectedColor)"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
  color: #383838;
  font-family: "Yusei Magic", sans-serif;
  letter-spacing: .75px;
}
.container {
  margin-inline: auto;
}
</style>
