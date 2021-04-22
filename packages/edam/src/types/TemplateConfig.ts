import { Edam } from '../index'

export type AsyncOrSync<T> = Promise<T> | T
export type PromptType = 'checkbox' | 'radio' | 'input' | 'suggest' | any

export interface Prompt {
  message: string
  default?: any
  yes?: boolean
  when?: (vars: Variables) => boolean
  name: string
  type: PromptType
  choices?: Array<any>
  transform?: Function
  deniesStore?: boolean
  transformer?: (val: any, set: Record<string, any>, context: Record<string, any>) => any
  validate?: (val: any, set: Record<string, any>, context: Record<string, any>) => string | boolean
}

export type Hook = string | ((...args: any[]) => void)

export type Glob = string

export type VarCenter = {
  once: Function
  always: Function // default
}

export type GetVariable = (vc: VarCenter) => AsyncOrSync<any>
export type Variable = GetVariable | any
export type Variables = {
  [name: string]: Variable
}

export type StrictLoader = Function & { raw?: boolean }
export type StrictLoaderWithOption = [StrictLoader, any]
export type Loader =
  | Array<StrictLoader | string | StrictLoaderWithOption>
  | string
  | StrictLoader
  | StrictLoaderWithOption

export type Matcher = Glob | Glob[] | RegExp | Function

export type Mapper = {
  test?: Matcher
  mimeTest?: Matcher
  loader: Loader
}

export type Dynamic<T> = (answer: object) => T | Promise<T>

// export const templateConfigType = w.leq({
//
// })

export function defineConfig(config: UserTemplateConfig) {
  return config
}

export type UserTemplateConfig = TemplateConfig | ((edam: Edam) => TemplateConfig)

export default interface TemplateConfig extends TemplateGeneratingConfig {
  prompts?: Array<Prompt>

  /**
   * answers => ({ hooks, ignore, ...(exclude prompts) })
   */
  process?: (answers: any) => TemplateGeneratingConfig
}

export interface TemplateGeneratingConfig {
  hooks?:
    | {
        [hookName: string]: Array<Hook> | Hook
      }
    | Dynamic<{
        [hookName: string]: Array<Hook> | Hook
      }>
  ignore?: string[] | Dynamic<string[]>
  variables?: Variables | Dynamic<Variables>
  root?: string | Dynamic<string>
  loaders?: {
    [loaderId: string]: Array<StrictLoader>
  }
  mappers?: Array<Mapper>

  move?: Dynamic<Record<string, string>> | Record<string, string>
  copy?: Dynamic<Record<string, string>> | Record<string, string>
  // remove?: string[]

  usefulHook?: {
    gitInit?: boolean
    installDependencies?: boolean
    installDevDependencies?: boolean
  }
}
