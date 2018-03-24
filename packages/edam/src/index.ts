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
import TemplateConfig, {Loader} from "./types/TemplateConfig";

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
  public sourcePullMethods: {
    [name: string]: (source: Source, edam: Edam) => string
  }
  public utils: {
    [name: string]: any
  }
  public constants: {
    [name: string]: any
  }
  public templateConfig: TemplateConfig = {
    loaders: {}
  }
  public track: Track
  constructor(public config: EdamConfig, public options: Options = {}) {
    this.setConfig(config)
    this.setOption(options)
    // fill
    this.utils = Object.assign({}, Edam.utils)
    this.sourcePullMethods = Object.assign({}, Edam.sourcePullMethods)
    this.constants = Object.assign({}, Edam.constants)
  }

  private async normalizeConfig(): Promise<Edam> {
    const { track, config } = await normalizeConfig(this.config, this.options)
    this.config = config
    this.track = track
    return this
  }

  public setLoader(loaderId: string, loader: Loader) {
    this.templateConfig.loaders[loaderId] = loader
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
    if (source) {
      const pullMethod = this.sourcePullMethods[source.type]
      if (typeof pullMethod !== 'function') {
        throw new EdamError(
          `source pull method is not found of type: ${source.type}`
        )
      }
      // eslint-disable-next-line no-unused-vars
      const templatePath: string = await pullMethod.call(this, source, this)
    }

    return {}
  }
}

async function edam(config: EdamConfig, options: Options) {
  return await new Edam(config, options)
}
Object.assign(edam, Edam, {
  Edam
})
module.exports = edam
