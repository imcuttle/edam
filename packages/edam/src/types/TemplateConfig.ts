export type AsyncOrSync<T> = Promise<T> | T
export type PromptType = 'checkbox' | 'radio' | 'input' | 'suggest'

export interface Prompt {
  message: string
  default?: any
  when?: (vars: object) => boolean
  name: string
  type: PromptType
  options?: Array<any>
  transform?: Function
}

export type Hook = string | Function

export type Glob = string

type VarCenter = {
  once: Function
  always: Function // default
}

type GetVariable = (vc: VarCenter) => AsyncOrSync<any>
export type Variable = GetVariable | any
export type Variables = {
  [name: string]: Variable
}
export type StrictLoader = Function & { raw?: boolean }
export type Loader = Array<StrictLoader | string> | string | StrictLoader
export default interface TemplateConfig {
  prompts?: Array<Prompt>
  hooks?: {
    [hookName: string]: Array<Hook> | Hook
  }
  files?: Array<Glob> | Glob
  variables?: Variables
  root?: string
  loaders?: {
    [loaderId: string]: Array<StrictLoader>
  }
  mapper?: {
    [glob: string]: Loader
  }
  move?: {}
  copy?: {}
}
