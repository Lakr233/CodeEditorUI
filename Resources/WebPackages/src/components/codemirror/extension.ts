import { Compartment, Extension } from '@codemirror/state'

const extensionMap = {
  theme: new Compartment(),
  language: new Compartment(),
}

export const codemirrorReconfigureExtension: Extension[] = [
  extensionMap.theme.of([]),
  extensionMap.language.of([]),
]

export { extensionMap as codemirrorReconfigureExtensionMap }
