import { Loader } from './TemplateConfig'

export type State = {
  input: string
  output?: string
  loaders?: Loader
  error?: Error
}

export interface Tree {
  [path: string]: State
}

export interface OutputInterface {
  writeToFile: (filepath: string) => Promise<boolean>
  tree: Tree
}

// export interface Resource {}
