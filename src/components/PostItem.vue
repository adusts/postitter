<script setup>
defineProps({
  post: { type: Object, required: true }
});
defineEmits(["delete"]);

</script>

<template>
  <article class="posts-item">
    <div class="posts-inner" :style="{ background: post.color || '#fff9c4' }">
      <p>{{ post.post }}</p>
    </div>
    <button class="btn-delete" @click="$emit('delete', post.id)">×</button>
  </article>
</template>

<style scoped>
.posts-item {
  --cut: 1.2rem;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  overflow: visible;
  filter: drop-shadow(1px 1px 1px rgba(118,116,116,0.488));
}
.posts-inner {
  padding: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%);
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
.posts-item p {
  margin: 0;
  text-align: justify;
}
.btn-delete {
  position: absolute;
  bottom: 0px;
  right: 3px;
  font-size: 1.2em;
  color: #949494;
  background: transparent;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.1s ease;
}
@media (hover: hover) {
  .posts-item:hover .btn-delete { opacity: 1; }
  .posts-item:hover { --cut: 2rem; }
}
</style>
