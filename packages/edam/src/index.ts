/**
 * @file: index
 * @author: Cuttle Cong
 * @date: 2018/1/26
 * @description:
 */

import normalizeConfig from './core/normalizeConfig'
import { EdamConfig, Source } from './types/Options'
import { Track } from './core/extendsConfig'
import { Options } from './core/normalizeSource'
import { Tree } from './types/core'
import * as presetSourcePull from './core/pull/preset'
import EdamError from './core/EdamError'
import * as coreExported from './core/index'
import * as libExported from './lib/index'
import * as constant from './core/constant'
import { Hook, Loader } from './types/TemplateConfig'
import {
  default as normalize,
  NormalizedTemplateConfig
} from './core/plugins/normalize'
import plugins, { Plugin } from './core/plugins'
import getTemplateConfig from './lib/getTemplateConfig'
import pReduce from 'p-reduce'
import * as _ from 'lodash'
import extendsMerge from './core/extendsMerge'

export class Edam {
  protected static sourcePullMethods: {
    [name: string]: (source: Source, edam: Edam) => string
  } = {
    ...presetSourcePull
  }
  protected static utils: {
    [name: string]: any
  } = {
    ...coreExported,
    ...libExported
  }
  protected static constants: {
    [name: string]: any
  } = {
    ...constant
  }
  protected static plugins: Array<Plugin> = plugins
  public plugins: Array<Plugin>
  public sourcePullMethods: {
    [name: string]: (source: Source, edam: Edam) => string
  }
  public utils: {
    [name: string]: any
  }
  public constants: {
    [name: string]: any
  }
  // public templateConfig: TemplateConfig
  public loaders: { [loaderId: string]: Loader }
  public track: Track
  constructor(public config: EdamConfig, public options: Options = {}) {
    this.setConfig(config)
    this.setOption(options)
    // fill
    this.utils = Object.assign({}, Edam.utils)
    this.sourcePullMethods = Object.assign({}, Edam.sourcePullMethods)
    this.constants = Object.assign({}, Edam.constants)
    this.plugins = Edam.plugins.slice()
  }

  private async normalizeConfig(): Promise<Edam> {
    const { track, config } = await normalizeConfig(this.config, this.options)
    this.config = config
    this.track = track

    if (this.config.plugins) {
      this.config.plugins.forEach(p => {
        this.use(p)
      })
    }

    return this
  }

  public addLoader(loaderId: string, loader: Loader): Edam {
    this.loaders[loaderId] = loader
    return this
  }
  public removeLoader(loaderId: string): Edam {
    delete this.loaders[loaderId]
    return this
  }
  public use(
    plugin: Plugin | Plugin[0],
    options = { force: false, removeExisted: true }
  ): Edam {
    if (!Array.isArray(plugin)) {
      plugin = [plugin, {}]
    }
    const index = this.plugins.findIndex(([p]) => p === plugin[0])
    if (options.force || index < 0) {
      if (options.force && index >= 0 && options.removeExisted) {
        this.plugins.splice(index, 1)
      }
      this.plugins.push(plugin)
    }
    return this
  }
  public unuse(pluginCore?: Plugin[0]): Edam {
    if (!pluginCore) {
      this.plugins = Edam.plugins.slice()
    } else {
      this.plugins = this.plugins.filter(([p]) => p !== pluginCore)
    }
    return this
  }
  public setConfig(config: EdamConfig): Edam {
    this.config = config
    return this
  }
  public setOption(options: Options): Edam {
    this.options = options
    return this
  }
  public async process(source?: Source): Promise<Tree> {
    this.config.source = source || this.config.source
    await this.normalizeConfig()

    source = <Source>this.config.source
    if (!source) {
      throw new EdamError('the `source` is required')
    }
    const pullMethod = this.sourcePullMethods[source.type]
    if (typeof pullMethod !== 'function') {
      throw new EdamError(
        `source pull method is not found of type: ${source.type}`
      )
    }
    let templateConfigPath: string = await pullMethod.call(this, source, this)
    templateConfigPath = this.templateConfigPath = require.resolve(
      templateConfigPath
    )
    let templateConfig = await getTemplateConfig.apply(this, [
      require(templateConfigPath),
      [this]
    ])
    let normalizedTemplateConfig: NormalizedTemplateConfig = normalize(
      templateConfig,
      templateConfigPath
    )

    this.templateConfig = normalizedTemplateConfig
    await pReduce(
      this.plugins.concat(this.config.plugins),
      async (config, plugin) => {
        await plugin.apply(this, [plugin[1] || {}, this])
      }
    )
    _.merge(this.templateConfig, {
      loaders: this.loaders,
      hooks: extendsMerge({}, normalizedTemplateConfig.hooks, this.hooks)
    })

    // @todo

    return {}
  }

  public templateConfig: NormalizedTemplateConfig = {
    files: [],
    loaders: {},
    mapper: {},
    root: ''
  }
  public templateConfigPath: string
  public hooks: {
    [hookName: string]: Array<Hook>
  } = {}
  public addHook(hookName: string, hook: Hook) {
    const arr: Array<Hook> = this.hooks[hookName] || []
    arr.push(hook)
    return this
  }
  public assets: {}
}

async function edam(config: EdamConfig, options: Options) {
  return await new Edam(config, options)
}
Object.assign(edam, Edam, {
  Edam
})
module.exports = edam
