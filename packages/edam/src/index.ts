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
import TemplateConfig from './types/TemplateConfig'
import * as _ from 'lodash'
import symbolic from './lib/symbolic'
import { store, get } from './core/storePrompts'
import fileSystem from './lib/fileSystem'

const inquirer = require('inquirer')
const tildify = require('tildify')
// const debug = require('debug')('edam:core')

require('util.promisify')

function throwEdamError(err, message) {
  if (err && err.id === '') {
    throw err
  }
  throw `${message} ${err.stack}`
}

export class Edam extends AwaitEventEmitter {
  public inquirer = inquirer

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
  public static constants: Constants = {
    ...constant
  }
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
    this.logger = new DefaultLogger()

    // proxy
    symbolic(this.compiler, 'logger', [this, 'logger'])
    symbolic(this.logger, 'silent', [this, ['config', 'silent']])

    symbolic(this.compiler, 'hookCwd', [this, ['config', 'output']])
    symbolic(this.compiler, 'root', [this, ['templateConfig', 'root']])
  }

  private async normalizeConfig(): Promise<Edam> {
    await this.emit('normalizeConfig:before', this.config, this.options)
    const { track, config } = await normalizeConfig(this.config, this.options)
    this.config = config
    this.track = track
    await this.emit('normalizeConfig:after', this.config)
    return this
  }

  public use(
    plugin: Plugin | Plugin[0],
    options = { force: false, removeExisted: true }
  ): Edam {
    if (!Array.isArray(plugin)) {
      plugin = [plugin, {}]
    }
    const index = this.config.plugins.findIndex(([p]) => p === plugin[0])
    if (options.force || index < 0) {
      if (options.force && index >= 0 && options.removeExisted) {
        this.config.plugins.splice(index, 1)
      }
      this.config.plugins.push(plugin)
    }
    return this
  }
  public unuse(pluginCore: Plugin[0]): Edam {
    this.config.plugins = this.config.plugins.filter(([p]) => p !== pluginCore)
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

  public prompt: Function = prompt

  private async _promptPrivate(prompts = this.templateConfig.prompts) {
    try {
      const context = {
        ...this.constants.DEFAULT_CONTEXT,
        absoluteDir: this.config.output,
        dirName: this.config.output && nps.dirname(this.config.output)
      }

      if (this.config.storePrompts && this.config.cacheDir) {
        let oldPromptValues = await get({
          source: <Source>this.config.source,
          cacheDir: this.config.cacheDir
        })

        oldPromptValues &&
          Object.keys(oldPromptValues).length &&
          prompts.forEach(prom => {
            const { name } = prom
            if (typeof oldPromptValues[name] !== 'undefined') {
              prom.default = oldPromptValues[name]
            }
          })
      }

      await this.emit('prompt:before', prompts, context)
      const promptValues = await this.prompt(prompts, {
        yes: this.config.yes,
        context,
        promptProcess: this.promptProcess
      })
      this.compiler.variables.setStore(promptValues)

      if (this.config.storePrompts && this.config.cacheDir) {
        await store(promptValues, {
          source: <Source>this.config.source,
          cacheDir: this.config.cacheDir
        })
      }
      this.compiler.variables.merge({ _: context })
      await this.emit('prompt:after', this.compiler.variables)
    } catch (err) {
      throwEdamError(err, 'Error occurs when prompting \n')
    }
  }

  public async pull(source?: Source) {
    try {
      this.config.source = source || this.config.source

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

      await this.emit('pull:before', source)
      let templateConfigPath: string = await pullMethod.apply(this, [
        source,
        this.config.cacheDir || this.constants.DEFAULT_CACHE_DIR,
        this.config
      ])
      templateConfigPath = this.templateConfigPath = require.resolve(
        templateConfigPath
      )

      await this.emit('pull:after', templateConfigPath)
    } catch (err) {
      throwEdamError(err, 'Error occurs when pulling \n')
    }
  }

  public async ready(source?: Source) {
    this.config.source = source || this.config.source
    await this.normalizeConfig()
    await this.registerPlugins(this.config.plugins)
    return this
  }

  public checkConfig() {
    const normalized = this.config
    if (!normalized.source) {
      throw new EdamError('Sorry, edam requires `source`')
    }

    if (typeof normalized.output !== 'string') {
      throw new EdamError(
        '`config.output` requires dir path, but ' + typeof normalized.output
      )
    }

    normalized.output = nps.resolve(this.options.cwd, normalized.output)
    if (fileSystem.isFile(normalized.output)) {
      throw new EdamError(
        '`config.output` requires dir path, but "' +
          tildify(normalized.output) +
          '" is a file now'
      )
    }

    if (!['npm', 'yarn'].includes(normalized.pull.npmClient)) {
      throw new EdamError(
        `config.pull.npmClient allows the value which is one of 'npm' | 'yarn'. but ${
          normalized.pull.npmClient
        }`
      )
    }
  }

  public async run(source?: Source): Promise<FileProcessor> {
    await this.ready(source)
    await this.checkConfig()
    await this.pull()
    return await this.process()
  }

  public async runPlugin(plugin: any): Promise<any> {
    let fn = plugin
    let options = {}
    if (Array.isArray(plugin)) {
      fn = plugin[0]
      options = plugin[1]
    }

    return await fn.apply(this, [options, this])
  }

  public async registerPlugins(plugins = []) {
    try {
      await pReduce(plugins.filter(Boolean), async (_, plugin) => {
        await this.runPlugin(plugin)
      })
    } catch (err) {
      throwEdamError(err, 'Error occurs when register Plugin: \n')
    }
  }

  public async process(
    templateConfigPath = this.templateConfigPath
  ): Promise<FileProcessor> {
    // preset plugins only do something about template
    await this.registerPlugins(plugins)

    let templateConfig =
      (await getTemplateConfig.apply(
        this,
        [require(templateConfigPath), [this, this]]
      )) || {}
    this.templateConfigPath = templateConfigPath = require.resolve(
      templateConfigPath
    )

    await this._promptPrivate(templateConfig.prompts)
    this.templateConfig = await normalize.apply(this, [
      templateConfig,
      templateConfigPath
    ])

    let tree
    try {
      await this.emit('compiler:before')
      tree = await this.compiler.run()
      await this.emit('compiler:after', tree)
    } catch (err) {
      throwEdamError(err, 'Error occurs when compiling \n')
    }

    const fp = new FileProcessor(tree, this.config.output, this.compiler)
    fp.logger = this.logger
    ;['move', 'copy'].forEach(name => {
      const config = this.templateConfig[name]
      if (_.isObject(config) && config !== null) {
        _.each(config, function(dest, from) {
          fp[name](from, dest)
        })
      }
    })
    fp.remove(this.templateConfig.remove)
    return fp
  }

  public templateConfig: NormalizedTemplateConfig | TemplateConfig = {
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
