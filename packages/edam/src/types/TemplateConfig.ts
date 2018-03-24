export type AsyncOrSync<T> = Promise<T> | T
export type PromptType = 'checkbox' | 'radio' | 'input'

export interface Prompt {
  message: string
  default: any
  name: string
  when: Function
  type: PromptType
  options?: Array<any>
  transform: Function
}

export type Hook = string | Function
export interface HookMap {
  [hookName: string]: Array<Hook> | Hook
}

export type Glob = string

type ComboCenter = {
  once: Function
  always: Function // default
}

type GetComboVariable = (cc: ComboCenter) => AsyncOrSync<any>

export type Combo = {
  [name: string]: GetComboVariable | any
}

export interface TemplateConfig {
  prompts: Array<Prompt>
  hooks: HookMap

  files: Array<Glob> | Glob
  combo: Combo
  // templateLoaders: {
  //   [name: string]: string | Function
  // }
  templateMapper: {
    [glob: Glob]: string | Function
  }
}
