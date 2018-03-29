import { Plugin } from '../core/plugins'

export type LogLevel = 'debug' | 'warn' | 'error' | 'log'
export type Source = {
  type: 'file' | 'git' | 'npm'
  url: string
  checkout?: string
  version?: string
}

export interface RCOptions {
  // template configuration file, or the name from `alias`, or repo string, npm package
  source?: string | Source
  cacheDir?: string | boolean
  // alias the source
  alias?: object
  // the wanted extend edam configuration file path (relative or absolute)
  extends?: string | Array<string>
  output?: string
  plugins?: Array<Plugin>
  pull?: {
    npmClient: 'yarn' | 'npm' // | 'cnpm' Not Support
    git: 'clone' | 'download'
  }
  storePrompts?: boolean
}

export interface EdamConfig extends RCOptions {
  // the template's name, be used for log
  // NOTE: it's unused now
  name?: string
  updateNotify?: boolean
  userc?: boolean
  yes?: boolean
  // when silent is `true` equals yes: true
  silent?: boolean
}
