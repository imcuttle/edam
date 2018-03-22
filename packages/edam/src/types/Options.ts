
export type LogLevel = 'debug' | 'warn' | 'error' | 'log'

export interface RCOptions {
  // template configuration file, or the name from `alias`, or repo string, npm package
  source: string
  cacheDir: string|boolean
  // alias the source
  alias?: object
  // the wanted extend edam configuration file path (relative or absolute)
  extends?: string|Array<string>
  logLevel: LogLevel
}

export interface EdamOptions extends RCOptions {
  // the template's name, be used for log
  name?: string
  userc: boolean
}
