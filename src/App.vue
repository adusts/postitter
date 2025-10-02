<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";

const newPost = ref("");
const Posts = ref([]);
const nextId = ref(1);
const grid = ref(null);
const selectedColor = ref("#f9faea");
const presetColors = ['#faf4e6', '#f5d7cd', '#eaf3ee', '#dde8e4', '#c6c5ca'];

function submitPost(e) {
    if (e && e.type === "keydown") {
    if (!(e.ctrlKey || e.metaKey)) {
      return;
    }
    e.preventDefault();
  }

  const post = newPost.value.trim();
  if (!post) return;
  Posts.value.push({ id: nextId.value++, post, color: selectedColor.value });
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
      <!-- <section class="posts-grid" ref="grid">
        <article
          class="posts-item"
          v-for="post in Posts"
          :key="post.id"
          :style="{ background: post.color || '#fff9c4' }">
          <p>{{ post.post }}</p>
          <button class="btn-delete" @click="deletePost(post.id)">×</button>
        </article>
      </section> -->
      <section class="posts-grid" ref="grid">
        <article
          class="posts-item"
          v-for="post in Posts"
          :key="post.id">
          <div
            class="posts-inner"
            :style="{ background: post.color || '#fff9c4' }">
            <p>{{ post.post }}</p>
          </div>

          <button class="btn-delete" @click="deletePost(post.id)">×</button>
        </article>
      </section>

      <form class="composer" @submit.prevent="submitPost">
        <!-- <label for="memo">ふせんを貼る</label> -->
        <textarea
          id="memo"
          v-model="newPost"
          rows="4"
          placeholder="テキストを入力し 追加またはCtrl＋Enterで貼り付け"
          @keydown.enter="submitPost"
        ></textarea>
        <div class="color-picker">
          <span
            v-for="preset in presetColors"
            :key="preset"
            class="color-swatch"
            :style="{ background: preset, border: selectedColor === preset ? '2px solid #333' : '1px solid #ccc' }"
            @click="selectedColor = preset">
          </span>
          <input type="color" class="color-circle" v-model="selectedColor" />
        </div>
        <button type="submit">追加</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem;
  color: #383838;
  font-family: "Yusei Magic", sans-serif;
  letter-spacing: .75px;
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
  font-family: 'Yusei Magic';
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
  --cut: 1.2rem;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: visible;
  filter: drop-shadow(1px 1px 1px rgba(118, 116, 116, 0.488));
}
.posts-inner {
  padding: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
  clip-path: polygon( 0 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%);
  height: 100%;
  transition: clip-path 0.2s ease;
}
.posts-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: var(--cut);
  height: var(--cut);
  background-color: #383838;
  clip-path: polygon(20% 0%, 100% 0%, 5% 95%);
  mix-blend-mode: overlay;
  transition: width 0.2s ease, height 0.2s ease;
}
.posts-item  p {
  margin: 0;
  text-align: justify;
}
.posts-item .btn-delete {
  position: absolute;
  bottom: 0px;
  right: 3px;
  font-size: 1.2em;
  color: #949494;
  background: transparent;
  line-height: 1;
  opacity: 0;
  transition: all .5s;
  transition: opacity 0.1s ease;
  filter: none;
  z-index: -1;
}
@media (hover: hover) {
  .posts-item:hover .btn-delete {
    opacity: 1;
  }
  .posts-item:hover {
    --cut: 2rem
  }
}
.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;

}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
}
.color-circle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  width: 30px;
  height: 32px;
  cursor: pointer;
  border: none;

}

</style>
