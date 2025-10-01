<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";

const newPost = ref("");
const Posts = ref([]);
const nextId = ref(1);
const grid = ref(null);

function submitPost(e) {
    if (e && e.type === "keydown") {
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    e.preventDefault();
  }

  const post = newPost.value.trim();
  if (!post) return;
  Posts.value.push({ id: nextId.value++, post });
  newPost.value = '';
  nextTick(resizeGridItems);
}

function deletePost(id) {
  Posts.value = Posts.value.filter((p) => p.id !== id);
}

onMounted(() => {
  const saved = localStorage.getItem('post-items');
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        Posts.value = arr;
        nextId.value = arr.reduce((m, n) => Math.max(m, n.id || 0), 0) + 1;
        nextTick(resizeGridItems);
      }
    } catch (_) {}
  }

  window.addEventListener("resize", resizeGridItems);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeGridItems);
});

watch(
  Posts,
  async (val) => {
    localStorage.setItem('post-items', JSON.stringify(val));
    await nextTick();
    resizeGridItems();
  },
  { deep: true }
);

onMounted(() => {
  const observer = new MutationObserver(() => resizeGridItems());
  if (grid.value) {
    observer.observe(grid.value, { childList: true, subtree: true });
  }
  window.addEventListener("resize", resizeGridItems);
});


function resizeGridItems() {
  if (!grid.value) return;

  const rowHeight = parseInt(
    window.getComputedStyle(grid.value).getPropertyValue("grid-auto-rows")
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid.value).getPropertyValue("gap")
  );

  const items = grid.value.querySelectorAll(".posts-item");

  items.forEach((item) => {
    item.style.gridRowEnd = "span 1";

    const contentHeight = item.scrollHeight;

    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));

    item.style.gridRowEnd = `span ${rowSpan}`;
  });
}

</script>

<template>
  <main>
    <div class="container">
    <!-- <h1>Postitter</h1> -->
      <section class="posts-grid" ref="grid">
        <article class="posts-item" v-for="post in Posts" :key="post.id">
          <p>{{ post.post }}</p>
          <button class="btn-delete" @click="deletePost(post.id)">×</button>
        </article>
      </section>

      <form class="composer" @submit.prevent="submitPost">
        <!-- <label for="memo">ふせんを貼る</label> -->
        <textarea
          id="memo"
          v-model="newPost"
          rows="4"
          placeholder="テキストを入力して「追加」で貼り付け"
          @keydown.enter="submitPost"
        ></textarea>
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
  margin-inline: auto;
}

.composer {
  display: grid;
  gap: 1rem;
}

.composer textarea {
  padding: 1rem .8rem 2rem;
  max-width: 300px;
  line-height: 1.5;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 8px;
  margin-bottom: 3rem;

}

.posts-item {
  padding: 1rem;
  background: #fff9c4;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 1px 1px 2px rgba(139, 120, 120, 0.12);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.posts-item  p {
  margin: 0;
}
article .btn-delete {
  position: absolute;
  top: 3px;
  right: 3px;
  /* background-color: rgb(183, 183, 183);
  padding: .3em .6em;
  color: #fff;
  clip-path: circle(50% at 50% 50%); */
  font-size: 1.2em;
  color: #949494;
  background: transparent;
  line-height: 1;
  opacity: 0;
  transition: transparent .3s;
}
@media (hover: hover) {
  article:hover .btn-delete {
    opacity: 1;
  }
}
</style>
