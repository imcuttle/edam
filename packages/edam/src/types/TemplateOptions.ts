
export type PromptType = 'checkbox' | 'radio' | 'input'

export interface Prompt {
  message: string
  default: any
  name: string
  when: Function
  type: PromptType
  options?: Array<any>
}

export type Hook = string|Function

export interface HookMap {
  [hookName: string]: Array<Hook>|Hook
}

export interface TemplateOptions {
  prompts: Array<Prompt>
  hooks: HookMap
}
