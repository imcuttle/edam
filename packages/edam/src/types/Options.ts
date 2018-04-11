import { Plugin } from '../core/plugins'

import {
  util,
  leq,
  oneOf,
  string,
  boolean,
  object,
  array,
  eq,
  function_,
  any,
  LooseEqual
} from 'walli'

const { createVerifiableClass } = util

// console.log(util)

const strictSource = createVerifiableClass({
  _check(req: any) {
    return leq({
      type: oneOf(['file', 'git', 'npm']),
      url: string(),
      checkout: string().optional(),
      version: string().optional()
    }).check(req)
  },
  getDisplayName() {
    return 'strictSource'
  }
})

const source = createVerifiableClass({
  _check(req: any) {
    return oneOf([strictSource(), string()]).check(req)
  },
  getDisplayName() {
    return 'source'
  }
})

export const rc: LooseEqual = leq({
  source: source().optional(),
  cacheDir: oneOf([boolean(), string()]).optional(),
  alias: object(source()).optional(),
  extends: oneOf([string(), array(string())]).optional(),
  output: string().optional(),
  plugins: array(eq([function_(), any()])).optional(),
  pull: leq({
    npmClient: oneOf(['yarn', 'npm']).optional(),
    git: oneOf(['clone', 'download']).optional()
  }).optional(),
  storePrompts: boolean().optional()
})

export const edam = rc.assign(
  leq({
    name: string().optional(),
    updateNotify: boolean().optional(),
    yes: boolean().optional(),
    silent: boolean().optional()
  })
)

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
