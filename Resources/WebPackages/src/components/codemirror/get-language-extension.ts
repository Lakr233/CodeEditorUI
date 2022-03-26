import { cpp } from '@codemirror/lang-cpp'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { languages } from '@codemirror/language-data'
import { shellLangDescription } from './lang/shell'
import { swiftLangDescription } from './lang/swift'
import { yamlLangDescription } from './lang/yaml'

export const getLanguageExtension = async (lang: string) => {
  switch (lang) {
    case 'shell':
    case 'sh':
      const shell = await shellLangDescription
        .load()
        .then((res) => res.extension)
      return shell

    case 'swift':
      const swift = await swiftLangDescription
        .load()
        .then((res) => res.extension)
      return swift

    case 'yaml':
      const yaml = await yamlLangDescription.load().then((res) => res.extension)
      return yaml
    case 'markdown':
    case 'md':
      return markdown({
        addKeymap: true,
        codeLanguages: languages,
        base: markdownLanguage,
      })
    case 'python':
      return python()

    case 'rust':
      return rust()
    case 'java':
      return java()
    case 'javascript':
    case 'typescript':
      return javascript({
        jsx: true,
        typescript: true,
      })

    case 'cpp':
      return cpp()
    case 'css':
      return css()
    case 'html':
      return html({
        autoCloseTags: true,
        matchClosingTags: true,
      })
    case 'json':
      return json()
    case 'xml':
      return xml()
    case 'sql':
      return sql()
  }

  return null
}

export const getAvailableLanguages = () => {
  return [
    'shell',
    'sh',
    'md',
    'markdown',
    'python',
    'rust',
    'java',
    'javascript',
    'typescript',
    'cpp',
    'css',
    'html',
    'json',
    'xml',
    'sql',
    'swift',
    'yaml',
  ]
}

export const isAvailableLanguage = (lang: string) => {
  return getAvailableLanguages().includes(lang)
}
