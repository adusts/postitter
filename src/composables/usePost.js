import { ref, watch } from "vue";

export function usePosts() {
  const posts = ref([]);
  const nextId = ref(1);
  const storageKey = "post-items";

  function addPost(text, color) {
    posts.value.push({ id: nextId.value++, post: text, color });
  }

  function deletePost(id) {
    posts.value = posts.value.filter((p) => p.id !== id);
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        posts.value = arr;
        nextId.value = arr.reduce((m, n) => Math.max(m, n.id || 0), 0) + 1;
      }
    } catch (_) { }
  }

  watch(
    posts,
    (val) => localStorage.setItem(storageKey, JSON.stringify(val)),
    { deep: true }
  );

  return { posts, addPost, deletePost };
}
