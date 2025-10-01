<script setup>
import { ref, onMounted, watch } from "vue";

const newPost = ref("");
const Posts = ref([]);
const nextId = ref(1);

function submitPost() {
  const post = newPost.value.trim();
  if (!post) return;
  Posts.value.push({ id: nextId.value++, post })
  newPost.value = '';
}

onMounted(() => {
  const saved = localStorage.getItem('post-items');
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        Posts.value = arr;
        nextId.value = arr.reduce((m, n) => Math.max(m ,n.id || 0), 0) + 1;
      }
    } catch (_) {}
  }
});

watch(
  Posts,
  (val) => localStorage.setItem('post-items', JSON.stringify(val)),
  { deep: true }
);
</script>

<template>
  <main>
    <div class="container">
    <!-- <h1>Postitter</h1> -->

    <section class="posts-grid">
      <article class="postit" v-for="post in Posts" :key="post.id">
        {{ post.post }}
      </article>
    </section>
    <form class="composer" @submit.prevent="submitPost">
      <label for="memo">ふせんを貼る</label>
      <textarea
      id="memo"
      v-model="newPost"
      row="4"
      placeholder="テキストを入力して「追加」で貼り付け"></textarea>
      <button type="submit">追加</button>
    </form>

    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  background-color: #edeae3;
  padding: 2rem;
}
.container {
  /* max-width: 960px; */
  margin-inline: auto;
}
.composer {
  display: grid;
  gap: 1rem;

}
.composer textarea {
  /* width: 100%; */
  padding: .8rem;
}
.composer button {
  justify-self: start;
    padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f7f7f7;
  cursor: pointer;
}
.posts-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  margin-bottom: 3rem;
  grid-template-rows: masonry;
}
.postit {
  padding: 10px 12px;
  background: #fff9c4;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 1px 1px 2px rgba(139, 120, 120, 0.12);
}
</style>
