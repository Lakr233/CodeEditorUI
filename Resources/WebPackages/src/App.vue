<template>
  <Editor :text="text" @update:value="handleUpdateValue" />
</template>

<script setup lang="ts">
import Editor from './components/codemirror/index.vue'

const text = ref('')
const setText = (_text: string) => {
  text.value = _text
}

/////// for webkit view
window.setText = setText

const handleUpdateValue = (_text: string) => {
  const message = { magic: 'content', msg: _text }
  window.webkit?.messageHandlers.callbackHandler.postMessage(message)
  text.value = _text
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

*::-webkit-scrollbar {
  display: none;
}
</style>
