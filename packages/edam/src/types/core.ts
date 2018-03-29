import { Loader, Prompt, Variable } from './TemplateConfig'
import * as AwaitEventEmitterCore from 'await-event-emitter'

export type State = {
  input: string
  output?: string
  loaders?: Loader
  error?: Error
}

export type PromptProcess = (prompt: Prompt) => Promise<Variable> | Variable

export interface Tree {
  [path: string]: State
}

export class AwaitEventEmitter extends AwaitEventEmitterCore {
  public emit: (name: string, ...any) => Promise<boolean>
  public emitSync: (name: string, ...any) => boolean
  public on: (name: string, ...any) => AwaitEventEmitter
  public once: (name: string, ...any) => AwaitEventEmitter
  public prependListener: (name: string, listener: Function) => AwaitEventEmitter
  public prependOnceListener: (name: string, listener: Function) => AwaitEventEmitter
  public removeListener: (name: string, listener?: Function) => AwaitEventEmitter
  public off: (name: string, listener?: Function) => AwaitEventEmitter
}

export interface Logger {
  silent: boolean
  log: Function
  success: Function
  warn: Function
  error: Function
}

export class TreeProcessor {
  public tree: Tree
  constructor(tree: Tree) {
    this.tree = tree
  }

  public toPrettyStates(): string {
    return JSON.stringify(this.tree, null, 2)
  }

  public toJSON() {
    return this.tree
  }
}

// export interface Resource {}
