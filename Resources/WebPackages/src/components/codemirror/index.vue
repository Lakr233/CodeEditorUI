<template>
  <div ref="refContainer" class="editor" />
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state'
import { PropType } from 'vue'
import { useCodeMirror } from './use-codemirror'

const emits = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'update:state', state: EditorState): void
}>()

const props = defineProps({
  deafultText: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },

  onChange: {
    type: Function as PropType<(value: string) => void>,
    required: false,
  },
  onStateChange: {
    type: Function as PropType<(state: EditorState) => void>,
    required: false,
  },
})
const language = ref('shell')
const [refContainer, editorView] = useCodeMirror({
  initialDoc: props.text ?? props.deafultText ?? '',
  language,
  onChange: (state) => {
    const value = state.doc.toString()

    emits('update:state', state)
    emits('update:value', value)

    props.onChange?.(state.doc.toString())
    props.onStateChange?.(state)
  },
})

watch(
  () => props.text,
  function watcher(text) {
    const view = editorView.value
    if (!view) {
      return requestAnimationFrame(() => watcher(text))
    }

    if (text !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
      })
    }
  },
)
onMounted(() => {
  if (!('webkit' in window)) {
    refContainer.value?.classList.add('in-browser')
  }
  editorView.value?.focus()
})
</script>

<style>
.editor {
  height: 100vh;
}
</style>

<style lang="postcss">
.cm-editor {
  & {
    @apply h-full;
  }

  .cm-editor {
    .cm-gutters,
    .cm-activeLineGutter,
    .cm-activeLine {
      @apply transition-colors duration-500;
    }
  }

  &.cm-focused {
    @apply !outline-none;
  }
}

.editor:not(.in-browser) {
  &,
  *:not(.cm-activeLine.cm-line):not(.cm-tooltip-autocomplete):not(.cm-tooltip-autocomplete
      *):not(.cm-activeLineGutter) {
    @apply !bg-transparent;
  }
}
</style>
