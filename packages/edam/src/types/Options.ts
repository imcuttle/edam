import { Plugin } from '../core/plugins'

import {
  util,
  leq,
  oneOf,
  string,
  boolean,
  objectOf,
  arrayOf,
  eq,
  function_,
  any,
  LooseEqual,
  Equal
} from 'walli'

const { createVerifiableClass } = util

const sourceConfig = createVerifiableClass<Equal>(
  {
    // getInitialRule() {
    //   return
    // },
    _check(req: any) {
      return eq({
        cacheDir: oneOf([boolean, string]).optional,
        output: string.optional,
        plugins: arrayOf(eq([function_, any])).optional,
        storePrompts: boolean.optional,
        pull: leq({
          npmClient: oneOf(['yarn', 'npm']).options,
          git: oneOf(['clone', 'download']).options
        }).optional
      }).check(req)
    },
    getDisplayName() {
      return 'sourceConfig'
    }
  },
  { ParentClass: Equal }
)

const strictSource = createVerifiableClass({
  _check(req: any) {
    return leq({
      type: oneOf(['file', 'git', 'npm']),
      url: string,
      config: sourceConfig().optional,
      checkout: string.optional,
      version: string.optional
    }).check(req)
  },
  getDisplayName() {
    return 'strictSource'
  }
})

const source = createVerifiableClass({
  _check(req: any) {
    return oneOf([strictSource(), string]).check(req)
  },
  getDisplayName() {
    return 'source'
  }
})

export const rc: Equal = leq({
  source: source().optional,
  // cacheDir: oneOf([boolean, string]).optional,
  alias: objectOf(source()).optional,
  extends: oneOf([string, arrayOf(string)]).optional,
  // output: string.optional,
  // plugins: arrayOf(eq([function_, any])).optional,
  // pull: leq({
  //   npmClient: oneOf(['yarn', 'npm']).optional,
  //   git: oneOf(['clone', 'download']).optional
  // }).optional,
  storePrompts: boolean.optional,
  offlineFallback: boolean.optional,
  updateNotify: boolean.optional,
  debug: boolean.optional
}).assign(sourceConfig())

export const edam: LooseEqual = rc.assign(
  leq({
    // walli's bug
    source: source().optional,

    name: string.optional,
    yes: boolean.optional,
    silent: boolean.optional
  })
)

export type SourceConfig = {
  cacheDir?: string | boolean
  output?: string
  plugins?: Array<Plugin>
  storePrompts?: boolean
  pull?: {
    npmClient: 'yarn' | 'npm' // | 'cnpm' Not Support
    git: 'clone' | 'download'
  }
}

export type Source = {
  type: 'file' | 'git' | 'npm'
  url: string
  config?: SourceConfig
  checkout?: string
  version?: string
}

// extendable config
export interface RCOptions extends SourceConfig {
  // template configuration file, or the name from `alias`, or repo string, npm package
  source?: string | Source
  // alias the source
  alias?: object
  ['extends']?: string | string[] // the wanted extend edam configuration file path (relative or absolute)
  offlineFallback?: boolean
  debug?: boolean
  updateNotify?: boolean
}

export interface EdamConfig extends RCOptions {
  // the template's name, be used for log
  // NOTE: it's unused now
  name?: string
  userc?: boolean
  yes?: boolean
  // when silent is `true` equals yes: true
  silent?: boolean
}
