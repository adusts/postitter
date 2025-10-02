<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit", "update:selectedColor"]);
const props = defineProps({
  presetColors: { type: Array, required: true },
  selectedColor: { type: String, required: true }
});

const newPost = ref("");

function setColor(color) {
  emit("update:selectedColor", color);
}

function handleSubmit(e) {
  if (e && e.type === "keydown" && !(e.ctrlKey || e.metaKey)) return;
  const text = newPost.value.trim();
  if (!text) return;
  emit("submit", text);
  newPost.value = "";
}
</script>

<template>
  <form class="composer" @submit.prevent="handleSubmit">
    <textarea
      v-model="newPost"
      rows="4"
      placeholder="テキストを入力し 追加またはCtrl＋Enterで貼り付け"
      @keydown.enter="handleSubmit"
    ></textarea>

    <div class="color-picker">
      <span
        v-for="preset in presetColors"
        :key="preset"
        class="color-swatch"
        :style="{ background: preset, border: selectedColor === preset ? '2px solid #333' : '1px solid #ccc' }"
        @click="setColor(preset)"
      ></span>
      <input
        type="color"
        class="color-circle"
        :value="selectedColor"
        @input="setColor($event.target.value)"
      />
    </div>

    <button type="submit">追加</button>
  </form>
</template>

<style scoped>
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
.color-picker {
  display: flex;
  gap: 8px;
}
.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
}
.color-circle {
  width: 30px;
  height: 32px;
  border: none;
  cursor: pointer;
}
</style>
