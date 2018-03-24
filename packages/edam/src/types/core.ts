import { Loader } from './TemplateConfig'

export type State = {
  input: string
  output: string
  useLoader: Loader
  error: Error
}

export interface Tree {
  [path: string]: State
}

export interface Output {
  writeToFile: (filepath: string) => boolean
  tree: Tree
}

export interface Resource {}
