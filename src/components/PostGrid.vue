<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import PostItem from "./PostItem.vue";

const props = defineProps({
  posts: { type: Array, required: true }
});
defineEmits(["delete"]);

const grid = ref(null);
let observer = null;

function resizeGridItems() {
  const el = grid.value;
  if (!el) return;

  const styles = getComputedStyle(el);
  const rowHeight = parseInt(styles.getPropertyValue("grid-auto-rows"));
  const rowGap = parseInt(styles.getPropertyValue("gap"));
  const items = el.querySelectorAll(".posts-item");

  items.forEach((item) => {
    item.style.gridRowEnd = "span 1";
    const contentHeight = item.scrollHeight;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  });
}

onMounted(async () => {
  await nextTick();
  resizeGridItems();

  observer = new MutationObserver(() => resizeGridItems());
  if (grid.value) {
    observer.observe(grid.value, { childList: true, subtree: true });
  }
  window.addEventListener("resize", resizeGridItems);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("resize", resizeGridItems);
});

// posts の変更（追加・削除・色変更）でリサイズ
watch(
  () => props.posts,
  async () => {
    await nextTick();
    resizeGridItems();
  },
  { deep: true }
);
</script>

<template>
  <section class="posts-grid" ref="grid">
    <PostItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @delete="$emit('delete', $event)"
    />
  </section>
</template>

<style scoped>
.posts-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 8px;
  margin-bottom: 3rem;
}
</style>
