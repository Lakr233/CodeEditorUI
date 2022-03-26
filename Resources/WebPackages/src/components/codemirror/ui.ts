import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view/dist'
import { githubLight } from '@ddietr/codemirror-themes/theme/github-light'
import { useDark } from '@vueuse/core'
import { Ref } from 'vue'
import { codemirrorReconfigureExtensionMap } from './extension'

export const useCodeMirrorAutoToggleTheme = (
  view: Ref<EditorView | undefined>,
) => {
  const dark = useDark({})

  watch(
    [dark, view],
    ([isDark]) => {
      if (!view.value) {
        return
      }

      if (isDark) {
        view.value.dispatch({
          effects: [
            codemirrorReconfigureExtensionMap.theme.reconfigure(oneDark),
          ],
        })
      } else {
        view.value.dispatch({
          effects: [
            codemirrorReconfigureExtensionMap.theme.reconfigure(githubLight),
          ],
        })
      }
    },

    { immediate: true, flush: 'post' },
  )
}
