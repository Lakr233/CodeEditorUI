import { VNodeProps } from 'vue'

declare global {
  export interface Window {
    [K: string]: any
  }

  export const Fragment: {
    new (): {
      $props: VNodeProps
    }
    __isFragment: true
  }

  export const __DEV__: boolean
}

export {}
