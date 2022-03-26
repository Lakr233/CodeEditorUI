import {
  acceptCompletion,
  autocompletion,
  startCompletion,
} from '@codemirror/autocomplete'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultKeymap } from '@codemirror/commands'
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { history } from '@codemirror/history'
import { bracketMatching } from '@codemirror/matchbrackets'
import { EditorState } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view'
import { onMounted, ref, Ref } from 'vue'
import {
  codemirrorReconfigureExtension,
  codemirrorReconfigureExtensionMap,
} from './extension'
import {
  getAvailableLanguages,
  getLanguageExtension,
  isAvailableLanguage,
} from './get-language-extension'
import { syntaxHighlighting } from './syntax-highlight'
import { useCodeMirrorAutoToggleTheme } from './ui'

export const customTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
})

interface Props {
  initialDoc: string
  language: Ref<string>
  onChange?: (state: EditorState) => void
}

export const useCodeMirror = <T extends Element>(
  props: Props,
): [Ref<T | undefined>, Ref<EditorView | undefined>] => {
  const refContainer = ref<T>()
  const editorView = ref<EditorView>()

  const { onChange } = props

  onMounted(async () => {
    if (!refContainer.value) return

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([
          ...defaultKeymap,
          ...closeBracketsKeymap,
          {
            key: 'Mod-s',
            run(view) {
              return false
            },
            preventDefault: true,
          },
          {
            key: 'Tab',
            run(target) {
              return acceptCompletion(target)
            },
          },
          {
            key: 'Shift-Space',
            run: startCompletion,
          },
        ]),
        closeBrackets(),
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        defaultHighlightStyle.fallback,
        history(),
        bracketMatching(),
        EditorState.tabSize.of(2),

        autocompletion(),

        syntaxHighlighting,
        ...codemirrorReconfigureExtension,

        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        }),

        EditorView.updateListener.of((update) => {
          if (update.heightChanged) {
            // @ts-ignore
            const height = update.view.viewState.heightMap.height
            window.webkit?.messageHandlers.callbackHandler.postMessage({
              type: 'height',
              msg: `${height}`,
            })
          }
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: refContainer.value,
    })

    editorView.value = view

    const languageExtension = await getLanguageExtension(props.language.value)
    languageExtension &&
      codemirrorReconfigureExtensionMap.language.reconfigure(languageExtension)

    view.dispatch({
      effects: [
        codemirrorReconfigureExtensionMap.language.reconfigure(
          languageExtension!,
        ),
      ],
    })

    registerWindowObjectForWebkit(view, {
      language: props.language,
    })
  })

  watch(
    () => props.language.value,
    async (language) => {
      const languageExtension = await getLanguageExtension(language)
      languageExtension &&
        codemirrorReconfigureExtensionMap.language.reconfigure(
          languageExtension,
        )

      editorView.value &&
        editorView.value.dispatch({
          effects: [
            codemirrorReconfigureExtensionMap.language.reconfigure(
              languageExtension!,
            ),
          ],
        })
    },
  )

  useCodeMirrorAutoToggleTheme(editorView)

  return [refContainer, editorView]
}

function registerWindowObjectForWebkit(view: EditorView, props: any) {
  /**
   * @see  https://lab.qaq.wiki/Lakr233/CodeEditorUI/-/issues/1
   */
  window.editor = view

  window.editor.setFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}px`
  }

  window.editor.setLanguage = (language: string) => {
    if (!isAvailableLanguage(language)) {
      return
    }
    // TODO can not set unavaliable language
    props.language.value = language
  }

  window.editor.getAvailableLanguages = getAvailableLanguages
}
