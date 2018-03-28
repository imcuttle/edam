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
import { AwaitEventEmitter, Logger, PromptProcess } from './types/core'
import * as presetSourcePull from './core/pull/preset'
import EdamError from './core/EdamError'
import * as coreExported from './core/index'
import * as libExported from './lib/index'
import constant from './core/constant'
import * as nps from 'path'
import {
  default as normalize,
  NormalizedTemplateConfig
} from './core/plugins/normalize'
import plugins, { Plugin } from './core/plugins'
import getTemplateConfig from './lib/getTemplateConfig'
import * as pReduce from 'p-reduce'
// import * as _ from 'lodash'
import Compiler from './core/Compiler/index'
// import { Variable } from './types/TemplateConfig'
import prompt from './core/promptProcessor'
import FileProcessor from './core/TreeProcessor/FileProcessor'
import { Constants } from './core/constant'
import DefaultLogger from './core/DefaultLogger'

export class Edam extends AwaitEventEmitter {
  public logger: Logger
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
  protected static constants: Constants = {
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
  public constants: Constants
  public track: Track
  constructor(public config?: EdamConfig, public options: Options = {}) {
    super()
    config && this.setConfig(config)
    options && this.setOption(options)
    // fill
    this.utils = Object.assign({}, Edam.utils)
    this.sourcePullMethods = Object.assign({}, Edam.sourcePullMethods)
    this.constants = Object.assign({}, Edam.constants)
    this.plugins = Edam.plugins.slice()

    this.logger = this.compiler.logger = new DefaultLogger()
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

  promptProcess: PromptProcess = require('./core/promptProcessor/cli/index')
    .default

  public async prompt() {
    const context = {
      ...this.constants.DEFAULT_CONTEXT,
      absoluteDir: this.config.output,
      dirName: this.config.output && nps.dirname(this.config.output)
    }
    await this.emit('prompt:before', this.templateConfig.prompts, context)
    this.compiler.variables.setStore(
      await prompt(this.templateConfig.prompts, {
        yes: this.config.yes,
        context,
        promptProcess: this.promptProcess
      })
    )
    this.compiler.variables.merge({ _: context })
    await this.emit('prompt:after', this.compiler.variables)
  }

  public async pull(source?: Source) {
    this.config.source = source || this.config.source

    source = <Source>this.config.source
    if (!source) {
      throw new EdamError('the `source` is required')
    }
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

    await this.emit('pull:before')
    let templateConfigPath: string = await pullMethod.apply(this, [
      source,
      this.config.cacheDir || this.constants.DEFAULT_CACHE_DIR,
      this.config
    ])
    templateConfigPath = this.templateConfigPath = require.resolve(
      templateConfigPath
    )

    await this.emit('pull:after', templateConfigPath)
  }

  public async run(
    source?: Source
  ): Promise<FileProcessor> {
    this.config.source = source || this.config.source
    await this.normalizeConfig()

    await pReduce(
      this.plugins.concat(this.config.plugins),
      async (config, plugin) => {
        let fn = plugin
        let options = {}
        if (Array.isArray(plugin)) {
          fn = plugin[0]
          options = plugin[1]
        }

        await fn.apply(this, [options, this])
      }
    )

    await this.pull()
    return await this.process()
  }

  public async process(templateConfigPath = this.templateConfigPath): Promise<FileProcessor> {
    let templateConfig =
      (await getTemplateConfig.apply(
        this,
        [require(templateConfigPath), [this, this]]
      )) || {}
    await this.emit('normalize:templateConfig:before', templateConfig)
    this.templateConfig = normalize(templateConfig, templateConfigPath)
    await this.emit('normalize:templateConfig:after', this.templateConfig)

    await this.prompt()

    await this.emit('compiler:before')
    const tree = await this.compiler.run()
    await this.emit('compiler:after', tree)
    return new FileProcessor(tree, this.config.output, this.compiler)
  }

  public templateConfig: NormalizedTemplateConfig = {
    ignore: [],
    loaders: {},
    mappers: [],
    root: '',
    usefulHook: {
      gitInit: false,
      installDependencies: false,
      installDevDependencies: false
    }
  }

  public templateConfigPath: string
  public compiler: Compiler = new Compiler()
}

function edam(config: EdamConfig, options: Options): Edam {
  return new Edam(config, options)
}

export { default as mockPrompts } from './mockPrompts'
export { default as Compiler } from './core/Compiler/index'
export { default as FileProcessor } from './core/TreeProcessor/FileProcessor'

export default edam
