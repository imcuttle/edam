export type AsyncOrSync<T> = Promise<T> | T
export type PromptType = 'checkbox' | 'radio' | 'input' | 'suggest'

export interface Prompt {
  message: string
  default?: any
  when?: Function
  name: string
  type: PromptType
  options?: Array<any>
  transform?: Function
}

export type Hook = string | Function

export type Glob = string

type ComboCenter = {
  once: Function
  always: Function // default
}

type GetComboVariable = (cc: ComboCenter) => AsyncOrSync<any>

export type Combo = {
  [name: string]: GetComboVariable | any
}


export type Loader = Array<string | Function> | string | Function
export default interface TemplateConfig {
  prompts?: Array<Prompt>
  hooks?: {
    [hookName: string]: Array<Hook> | Hook
  }
  files?: Array<Glob> | Glob
  combo?: Combo
  root?: string
  loaders?: {
    [loaderId: string]: Loader
  }
  mapper?: {
    [glob: string]: Loader
  }
  move?: {}
  copy?: {}
}
